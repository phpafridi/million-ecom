import { jsx } from "react/jsx-runtime";
import ReactDOMServer from "react-dom/server";
import { config as config$1, isUrlMethodPair, mergeDataIntoQueryString, getScrollableParent, useInfiniteScroll, router, UseFormUtils, formDataToObject, FormComponentResetSymbol, resetFormFields, shouldIntercept, shouldNavigate, getInitialPageFromDOM, setupProgress, createHeadManager } from "@inertiajs/core";
import React, { createContext, forwardRef, useRef, useMemo, useState, useEffect, useImperativeHandle, createElement, useCallback, Fragment, useContext } from "react";
import { flushSync } from "react-dom";
import { cloneDeep, isEqual, set, has, get, escape } from "lodash-es";
import { createValidator, toSimpleValidationErrors, resolveName } from "laravel-precognition";
import createServer from "@inertiajs/core/server";
var headContext = createContext(null);
headContext.displayName = "InertiaHeadContext";
var HeadContext_default = headContext;
var pageContext = createContext(null);
pageContext.displayName = "InertiaPageContext";
var PageContext_default = pageContext;
var currentIsInitialPage = true;
var routerIsInitialized = false;
var swapComponent = async () => {
  currentIsInitialPage = false;
};
function App({
  children,
  initialPage,
  initialComponent,
  resolveComponent,
  titleCallback,
  onHeadUpdate
}) {
  const [current, setCurrent] = useState({
    component: initialComponent || null,
    page: { ...initialPage, flash: initialPage.flash ?? {} },
    key: null
  });
  const headManager = useMemo(() => {
    return createHeadManager(
      typeof window === "undefined",
      titleCallback || ((title) => title),
      onHeadUpdate || (() => {
      })
    );
  }, []);
  if (!routerIsInitialized) {
    router.init({
      initialPage,
      resolveComponent,
      swapComponent: async (args) => swapComponent(args),
      onFlash: (flash) => {
        setCurrent((current2) => ({
          ...current2,
          page: { ...current2.page, flash }
        }));
      }
    });
    routerIsInitialized = true;
  }
  useEffect(() => {
    swapComponent = async ({ component, page, preserveState }) => {
      if (currentIsInitialPage) {
        currentIsInitialPage = false;
        return;
      }
      flushSync(
        () => setCurrent((current2) => ({
          component,
          page,
          key: preserveState ? current2.key : Date.now()
        }))
      );
    };
    router.on("navigate", () => headManager.forceUpdate());
  }, []);
  if (!current.component) {
    return createElement(
      HeadContext_default.Provider,
      { value: headManager },
      createElement(PageContext_default.Provider, { value: current.page }, null)
    );
  }
  const renderChildren = children || (({ Component, props, key }) => {
    const child = createElement(Component, { key, ...props });
    if (typeof Component.layout === "function") {
      return Component.layout(child);
    }
    if (Array.isArray(Component.layout)) {
      return Component.layout.concat(child).reverse().reduce((children2, Layout) => createElement(Layout, { children: children2, ...props }));
    }
    return child;
  });
  return createElement(
    HeadContext_default.Provider,
    { value: headManager },
    createElement(
      PageContext_default.Provider,
      { value: current.page },
      renderChildren({
        Component: current.component,
        key: current.key,
        props: current.page.props
      })
    )
  );
}
App.displayName = "Inertia";
async function createInertiaApp({
  id = "app",
  resolve,
  setup,
  title,
  progress: progress2 = {},
  page,
  render,
  defaults = {}
}) {
  config.replace(defaults);
  const isServer = typeof window === "undefined";
  const useScriptElementForInitialPage = config.get("future.useScriptElementForInitialPage");
  const initialPage = page || getInitialPageFromDOM(id, useScriptElementForInitialPage);
  const resolveComponent = (name) => Promise.resolve(resolve(name)).then((module) => module.default || module);
  let head = [];
  const reactApp = await Promise.all([
    resolveComponent(initialPage.component),
    router.decryptHistory().catch(() => {
    })
  ]).then(([initialComponent]) => {
    const props = {
      initialPage,
      initialComponent,
      resolveComponent,
      titleCallback: title
    };
    if (isServer) {
      const ssrSetup = setup;
      return ssrSetup({
        el: null,
        App,
        props: { ...props, onHeadUpdate: (elements) => head = elements }
      });
    }
    const csrSetup = setup;
    return csrSetup({
      el: document.getElementById(id),
      App,
      props
    });
  });
  if (!isServer && progress2) {
    setupProgress(progress2);
  }
  if (isServer && render) {
    const element = () => {
      if (!useScriptElementForInitialPage) {
        return createElement(
          "div",
          {
            id,
            "data-page": JSON.stringify(initialPage)
          },
          reactApp
        );
      }
      return createElement(
        Fragment,
        null,
        createElement("script", {
          "data-page": id,
          type: "application/json",
          dangerouslySetInnerHTML: { __html: JSON.stringify(initialPage).replace(/\//g, "\\/") }
        }),
        createElement("div", { id }, reactApp)
      );
    };
    const body = await render(element());
    return { head, body };
  }
}
var isReact19 = typeof React.use === "function";
function usePage() {
  const page = isReact19 ? React.use(PageContext_default) : React.useContext(PageContext_default);
  if (!page) {
    throw new Error("usePage must be used within the Inertia component");
  }
  return page;
}
function useRemember(initialState, key, excludeKeysRef) {
  const [state, setState] = useState(() => {
    const restored = router.restore(key);
    return restored !== void 0 ? restored : initialState;
  });
  useEffect(() => {
    const keys = excludeKeysRef == null ? void 0 : excludeKeysRef.current;
    if (keys && keys.length > 0 && typeof state === "object" && state !== null) {
      const filtered = { ...state };
      keys.forEach((k) => delete filtered[k]);
      router.remember(filtered, key);
    } else {
      router.remember(state, key);
    }
  }, [state, key]);
  return [state, setState];
}
function useForm(...args) {
  const isMounted = useRef(false);
  const parsedArgs = UseFormUtils.parseUseFormArguments(...args);
  const { rememberKey, data: initialData } = parsedArgs;
  const precognitionEndpoint = useRef(parsedArgs.precognitionEndpoint);
  const [defaults, setDefaults] = useState(
    typeof initialData === "function" ? cloneDeep(initialData()) : cloneDeep(initialData)
  );
  const cancelToken = useRef(null);
  const recentlySuccessfulTimeoutId = useRef(void 0);
  const excludeKeysRef = useRef([]);
  const [data, setData] = rememberKey ? useRemember(defaults, `${rememberKey}:data`, excludeKeysRef) : useState(defaults);
  const [errors, setErrors] = rememberKey ? useRemember({}, `${rememberKey}:errors`) : useState({});
  const [hasErrors, setHasErrors] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress2, setProgress] = useState(null);
  const [wasSuccessful, setWasSuccessful] = useState(false);
  const [recentlySuccessful, setRecentlySuccessful] = useState(false);
  const transform = useRef((data2) => data2);
  const isDirty = useMemo(() => !isEqual(data, defaults), [data, defaults]);
  const validatorRef = useRef(null);
  const [validating, setValidating] = useState(false);
  const [touchedFields, setTouchedFields] = useState([]);
  const [validFields, setValidFields] = useState([]);
  const withAllErrors = useRef(null);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const setDefaultsCalledInOnSuccess = useRef(false);
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  });
  const commitData = useCallback(
    (next) => {
      dataRef.current = next;
      setData(next);
    },
    [setData]
  );
  const submit = useCallback(
    (...args2) => {
      const { method, url, options } = UseFormUtils.parseSubmitArguments(args2, precognitionEndpoint.current);
      setDefaultsCalledInOnSuccess.current = false;
      const _options = {
        ...options,
        onCancelToken: (token) => {
          cancelToken.current = token;
          if (options.onCancelToken) {
            return options.onCancelToken(token);
          }
        },
        onBefore: (visit) => {
          setWasSuccessful(false);
          setRecentlySuccessful(false);
          clearTimeout(recentlySuccessfulTimeoutId.current);
          if (options.onBefore) {
            return options.onBefore(visit);
          }
        },
        onStart: (visit) => {
          setProcessing(true);
          if (options.onStart) {
            return options.onStart(visit);
          }
        },
        onProgress: (event) => {
          setProgress(event || null);
          if (options.onProgress) {
            return options.onProgress(event);
          }
        },
        onSuccess: async (page) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors({});
            setHasErrors(false);
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            recentlySuccessfulTimeoutId.current = setTimeout(() => {
              if (isMounted.current) {
                setRecentlySuccessful(false);
              }
            }, config.get("form.recentlySuccessfulDuration"));
          }
          const onSuccess = options.onSuccess ? await options.onSuccess(page) : null;
          if (isMounted.current && !setDefaultsCalledInOnSuccess.current) {
            setData((data2) => {
              setDefaults(cloneDeep(data2));
              return data2;
            });
          }
          return onSuccess;
        },
        onError: (errors2) => {
          var _a;
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
            setErrors(errors2);
            setHasErrors(Object.keys(errors2).length > 0);
            (_a = validatorRef.current) == null ? void 0 : _a.setErrors(errors2);
          }
          if (options.onError) {
            return options.onError(errors2);
          }
        },
        onCancel: () => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          if (options.onCancel) {
            return options.onCancel();
          }
        },
        onFinish: (visit) => {
          if (isMounted.current) {
            setProcessing(false);
            setProgress(null);
          }
          cancelToken.current = null;
          if (options.onFinish) {
            return options.onFinish(visit);
          }
        }
      };
      const transformedData = transform.current(dataRef.current);
      if (method === "delete") {
        router.delete(url, { ..._options, data: transformedData });
      } else {
        router[method](url, transformedData, _options);
      }
    },
    [setErrors, transform]
  );
  const setDataFunction = useCallback(
    (keyOrData, maybeValue) => {
      if (typeof keyOrData === "string") {
        commitData(set(cloneDeep(dataRef.current), keyOrData, maybeValue));
      } else if (typeof keyOrData === "function") {
        commitData(keyOrData(dataRef.current));
      } else {
        commitData(keyOrData);
      }
    },
    [commitData]
  );
  const setDefaultsFunction = useCallback(
    (fieldOrFields, maybeValue) => {
      var _a;
      setDefaultsCalledInOnSuccess.current = true;
      let newDefaults = {};
      if (typeof fieldOrFields === "undefined") {
        newDefaults = { ...dataRef.current };
        setDefaults(dataRef.current);
      } else {
        setDefaults((defaults2) => {
          newDefaults = typeof fieldOrFields === "string" ? set(cloneDeep(defaults2), fieldOrFields, maybeValue) : Object.assign(cloneDeep(defaults2), fieldOrFields);
          return newDefaults;
        });
      }
      (_a = validatorRef.current) == null ? void 0 : _a.defaults(newDefaults);
    },
    [setDefaults]
  );
  const reset = useCallback(
    (...fields) => {
      var _a;
      if (fields.length === 0) {
        commitData(defaults);
      } else {
        const next = fields.filter((key) => has(defaults, key)).reduce(
          (carry, key) => {
            return set(carry, key, get(defaults, key));
          },
          { ...dataRef.current }
        );
        commitData(next);
      }
      (_a = validatorRef.current) == null ? void 0 : _a.reset(...fields);
    },
    [commitData, defaults]
  );
  const setError = useCallback(
    (fieldOrFields, maybeValue) => {
      setErrors((errors2) => {
        var _a;
        const newErrors = {
          ...errors2,
          ...typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields
        };
        setHasErrors(Object.keys(newErrors).length > 0);
        (_a = validatorRef.current) == null ? void 0 : _a.setErrors(newErrors);
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const clearErrors = useCallback(
    (...fields) => {
      setErrors((errors2) => {
        const newErrors = Object.keys(errors2).reduce(
          (carry, field) => ({
            ...carry,
            ...fields.length > 0 && !fields.includes(field) ? { [field]: errors2[field] } : {}
          }),
          {}
        );
        setHasErrors(Object.keys(newErrors).length > 0);
        if (validatorRef.current) {
          if (fields.length === 0) {
            validatorRef.current.setErrors({});
          } else {
            fields.forEach(validatorRef.current.forgetError);
          }
        }
        return newErrors;
      });
    },
    [setErrors, setHasErrors]
  );
  const resetAndClearErrors = useCallback(
    (...fields) => {
      reset(...fields);
      clearErrors(...fields);
    },
    [reset, clearErrors]
  );
  const createSubmitMethod = (method) => (url, options = {}) => {
    submit(method, url, options);
  };
  const getMethod = useCallback(createSubmitMethod("get"), [submit]);
  const post = useCallback(createSubmitMethod("post"), [submit]);
  const put = useCallback(createSubmitMethod("put"), [submit]);
  const patch = useCallback(createSubmitMethod("patch"), [submit]);
  const deleteMethod = useCallback(createSubmitMethod("delete"), [submit]);
  const cancel = useCallback(() => {
    if (cancelToken.current) {
      cancelToken.current.cancel();
    }
  }, []);
  const transformFunction = useCallback((callback) => {
    transform.current = callback;
  }, []);
  const form = {
    data,
    setData: setDataFunction,
    isDirty,
    errors,
    hasErrors,
    processing,
    progress: progress2,
    wasSuccessful,
    recentlySuccessful,
    transform: transformFunction,
    setDefaults: setDefaultsFunction,
    reset,
    setError,
    clearErrors,
    resetAndClearErrors,
    submit,
    get: getMethod,
    post,
    put,
    patch,
    delete: deleteMethod,
    cancel,
    dontRemember: (...keys) => {
      excludeKeysRef.current = keys;
      return form;
    }
  };
  const tap = (value, callback) => {
    callback(value);
    return value;
  };
  const valid = useCallback(
    (field) => validFields.includes(field),
    [validFields]
  );
  const invalid = useCallback((field) => field in errors, [errors]);
  const touched = useCallback(
    (field) => typeof field === "string" ? touchedFields.includes(field) : touchedFields.length > 0,
    [touchedFields]
  );
  const validate = (field, config3) => {
    if (typeof field === "object" && !("target" in field)) {
      config3 = field;
      field = void 0;
    }
    if (field === void 0) {
      validatorRef.current.validate(config3);
    } else {
      const fieldName = resolveName(field);
      const currentData = dataRef.current;
      const transformedData = transform.current(currentData);
      validatorRef.current.validate(fieldName, get(transformedData, fieldName), config3);
    }
    return form;
  };
  const withPrecognition = (...args2) => {
    precognitionEndpoint.current = UseFormUtils.createWayfinderCallback(...args2);
    if (!validatorRef.current) {
      const validator = createValidator((client) => {
        const { method, url } = precognitionEndpoint.current();
        const currentData = dataRef.current;
        const transformedData = transform.current(currentData);
        return client[method](url, transformedData);
      }, cloneDeep(defaults));
      validatorRef.current = validator;
      validator.on("validatingChanged", () => {
        setValidating(validator.validating());
      }).on("validatedChanged", () => {
        setValidFields(validator.valid());
      }).on("touchedChanged", () => {
        setTouchedFields(validator.touched());
      }).on("errorsChanged", () => {
        const validationErrors = withAllErrors.current ?? config.get("form.withAllErrors") ? validator.errors() : toSimpleValidationErrors(validator.errors());
        setErrors(validationErrors);
        setHasErrors(Object.keys(validationErrors).length > 0);
        setValidFields(validator.valid());
      });
    }
    const precognitiveForm = Object.assign(form, {
      validating,
      validator: () => validatorRef.current,
      valid,
      invalid,
      touched,
      withoutFileValidation: () => tap(precognitiveForm, () => {
        var _a;
        return (_a = validatorRef.current) == null ? void 0 : _a.withoutFileValidation();
      }),
      touch: (field, ...fields) => {
        var _a, _b, _c;
        if (Array.isArray(field)) {
          (_a = validatorRef.current) == null ? void 0 : _a.touch(field);
        } else if (typeof field === "string") {
          (_b = validatorRef.current) == null ? void 0 : _b.touch([field, ...fields]);
        } else {
          (_c = validatorRef.current) == null ? void 0 : _c.touch(field);
        }
        return precognitiveForm;
      },
      withAllErrors: () => tap(precognitiveForm, () => withAllErrors.current = true),
      setValidationTimeout: (duration) => tap(precognitiveForm, () => {
        var _a;
        return (_a = validatorRef.current) == null ? void 0 : _a.setTimeout(duration);
      }),
      validateFiles: () => tap(precognitiveForm, () => {
        var _a;
        return (_a = validatorRef.current) == null ? void 0 : _a.validateFiles();
      }),
      validate,
      setErrors: (errors2) => tap(precognitiveForm, () => form.setError(errors2)),
      forgetError: (field) => tap(
        precognitiveForm,
        () => form.clearErrors(resolveName(field))
      )
    });
    return precognitiveForm;
  };
  form.withPrecognition = withPrecognition;
  return precognitionEndpoint.current ? form.withPrecognition(precognitionEndpoint.current) : form;
}
var deferStateUpdate = (callback) => {
  typeof React.startTransition === "function" ? React.startTransition(callback) : setTimeout(callback, 0);
};
var noop = () => void 0;
var FormContext = createContext(void 0);
var Form = forwardRef(
  ({
    action = "",
    method = "get",
    headers = {},
    queryStringArrayFormat = "brackets",
    errorBag = null,
    showProgress = true,
    transform = (data) => data,
    options = {},
    onStart = noop,
    onProgress = noop,
    onFinish = noop,
    onBefore = noop,
    onCancel = noop,
    onSuccess = noop,
    onError = noop,
    onCancelToken = noop,
    onSubmitComplete = noop,
    disableWhileProcessing = false,
    resetOnError = false,
    resetOnSuccess = false,
    setDefaultsOnSuccess = false,
    invalidateCacheTags = [],
    validateFiles = false,
    validationTimeout = 1500,
    withAllErrors = null,
    children,
    ...props
  }, ref) => {
    const getTransformedData = () => {
      const [_url, data] = getUrlAndData();
      return transform(data);
    };
    const form = useForm({}).withPrecognition(
      () => resolvedMethod,
      () => getUrlAndData()[0]
    ).setValidationTimeout(validationTimeout);
    if (validateFiles) {
      form.validateFiles();
    }
    if (withAllErrors ?? config$1.get("form.withAllErrors")) {
      form.withAllErrors();
    }
    form.transform(getTransformedData);
    const formElement = useRef(void 0);
    const resolvedMethod = useMemo(() => {
      return isUrlMethodPair(action) ? action.method : method.toLowerCase();
    }, [action, method]);
    const [isDirty, setIsDirty] = useState(false);
    const defaultData = useRef(new FormData());
    const getFormData = (submitter) => new FormData(formElement.current, submitter);
    const getData = (submitter) => formDataToObject(getFormData(submitter));
    const getUrlAndData = (submitter) => {
      return mergeDataIntoQueryString(
        resolvedMethod,
        isUrlMethodPair(action) ? action.url : action,
        getData(submitter),
        queryStringArrayFormat
      );
    };
    const updateDirtyState = (event) => {
      var _a;
      if (event.type === "reset" && ((_a = event.detail) == null ? void 0 : _a[FormComponentResetSymbol])) {
        event.preventDefault();
      }
      deferStateUpdate(
        () => setIsDirty(event.type === "reset" ? false : !isEqual(getData(), formDataToObject(defaultData.current)))
      );
    };
    const clearErrors = (...names) => {
      form.clearErrors(...names);
      return form;
    };
    useEffect(() => {
      defaultData.current = getFormData();
      form.setDefaults(getData());
      const formEvents = ["input", "change", "reset"];
      formEvents.forEach((e) => formElement.current.addEventListener(e, updateDirtyState));
      return () => {
        formEvents.forEach((e) => {
          var _a;
          return (_a = formElement.current) == null ? void 0 : _a.removeEventListener(e, updateDirtyState);
        });
      };
    }, []);
    useEffect(() => {
      form.setValidationTimeout(validationTimeout);
    }, [validationTimeout]);
    useEffect(() => {
      if (validateFiles) {
        form.validateFiles();
      } else {
        form.withoutFileValidation();
      }
    }, [validateFiles]);
    const reset = (...fields) => {
      if (formElement.current) {
        resetFormFields(formElement.current, defaultData.current, fields);
      }
      form.reset(...fields);
    };
    const resetAndClearErrors = (...fields) => {
      clearErrors(...fields);
      reset(...fields);
    };
    const maybeReset = (resetOption) => {
      if (!resetOption) {
        return;
      }
      if (resetOption === true) {
        reset();
      } else if (resetOption.length > 0) {
        reset(...resetOption);
      }
    };
    const submit = (submitter) => {
      const [url, data] = getUrlAndData(submitter);
      const formTarget = submitter == null ? void 0 : submitter.getAttribute("formtarget");
      if (formTarget === "_blank" && resolvedMethod === "get") {
        window.open(url, "_blank");
        return;
      }
      const submitOptions = {
        headers,
        queryStringArrayFormat,
        errorBag,
        showProgress,
        invalidateCacheTags,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess: (...args) => {
          onSuccess(...args);
          onSubmitComplete({
            reset,
            defaults
          });
          maybeReset(resetOnSuccess);
          if (setDefaultsOnSuccess === true) {
            defaults();
          }
        },
        onError(...args) {
          onError(...args);
          maybeReset(resetOnError);
        },
        ...options
      };
      form.transform(() => transform(data));
      form.submit(resolvedMethod, url, submitOptions);
      form.transform(getTransformedData);
    };
    const defaults = () => {
      defaultData.current = getFormData();
      setIsDirty(false);
    };
    const exposed = {
      errors: form.errors,
      hasErrors: form.hasErrors,
      processing: form.processing,
      progress: form.progress,
      wasSuccessful: form.wasSuccessful,
      recentlySuccessful: form.recentlySuccessful,
      isDirty,
      clearErrors,
      resetAndClearErrors,
      setError: form.setError,
      reset,
      submit,
      defaults,
      getData,
      getFormData,
      // Precognition
      validator: () => form.validator(),
      validating: form.validating,
      valid: form.valid,
      invalid: form.invalid,
      validate: (field, config3) => form.validate(...UseFormUtils.mergeHeadersForValidation(field, config3, headers)),
      touch: form.touch,
      touched: form.touched
    };
    useImperativeHandle(ref, () => exposed, [form, isDirty, submit]);
    const formNode = createElement(
      "form",
      {
        ...props,
        ref: formElement,
        action: isUrlMethodPair(action) ? action.url : action,
        method: resolvedMethod,
        onSubmit: (event) => {
          event.preventDefault();
          submit(event.nativeEvent.submitter);
        },
        // React 19 supports passing a boolean to the `inert` attribute, but shows
        // a warning when receiving a string. Earlier versions require the string 'true'.
        // See: https://github.com/inertiajs/inertia/pull/2536
        inert: disableWhileProcessing && form.processing && (isReact19 ? true : "true")
      },
      typeof children === "function" ? children(exposed) : children
    );
    return createElement(FormContext.Provider, { value: exposed }, formNode);
  }
);
Form.displayName = "InertiaForm";
var Head = function({ children, title }) {
  const headManager = useContext(HeadContext_default);
  const provider = useMemo(() => headManager.createProvider(), [headManager]);
  const isServer = typeof window === "undefined";
  useEffect(() => {
    provider.reconnect();
    provider.update(renderNodes(children));
    return () => {
      provider.disconnect();
    };
  }, [provider, children, title]);
  function isUnaryTag(node) {
    return typeof node.type === "string" && [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr"
    ].indexOf(node.type) > -1;
  }
  function renderTagStart(node) {
    const attrs = Object.keys(node.props).reduce((carry, name) => {
      if (["head-key", "children", "dangerouslySetInnerHTML"].includes(name)) {
        return carry;
      }
      const value = String(node.props[name]);
      if (value === "") {
        return carry + ` ${name}`;
      }
      return carry + ` ${name}="${escape(value)}"`;
    }, "");
    return `<${String(node.type)}${attrs}>`;
  }
  function renderTagChildren(node) {
    const { children: children2 } = node.props;
    if (typeof children2 === "string") {
      return children2;
    }
    if (Array.isArray(children2)) {
      return children2.reduce((html, child) => html + renderTag(child), "");
    }
    return "";
  }
  function renderTag(node) {
    let html = renderTagStart(node);
    if (node.props.children) {
      html += renderTagChildren(node);
    }
    if (node.props.dangerouslySetInnerHTML) {
      html += node.props.dangerouslySetInnerHTML.__html;
    }
    if (!isUnaryTag(node)) {
      html += `</${String(node.type)}>`;
    }
    return html;
  }
  function ensureNodeHasInertiaProp(node) {
    return React.cloneElement(node, {
      [provider.preferredAttribute()]: node.props["head-key"] !== void 0 ? node.props["head-key"] : ""
    });
  }
  function renderNode(node) {
    return renderTag(ensureNodeHasInertiaProp(node));
  }
  function renderNodes(nodes) {
    const elements = React.Children.toArray(nodes).filter((node) => node).map((node) => renderNode(node));
    if (title && !elements.find((tag) => tag.startsWith("<title"))) {
      elements.push(`<title ${provider.preferredAttribute()}>${escape(title)}</title>`);
    }
    return elements;
  }
  if (isServer) {
    provider.update(renderNodes(children));
  }
  return null;
};
var Head_default = Head;
var resolveHTMLElement = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  if (value && typeof value === "object" && "current" in value) {
    return value.current;
  }
  if (typeof value === "string") {
    return document.querySelector(value);
  }
  return fallback;
};
var renderSlot = (slotContent, slotProps, fallback = null) => {
  if (!slotContent) {
    return fallback;
  }
  return typeof slotContent === "function" ? slotContent(slotProps) : slotContent;
};
var InfiniteScroll = forwardRef(
  ({
    data,
    buffer = 0,
    as = "div",
    manual = false,
    manualAfter = 0,
    preserveUrl = false,
    reverse = false,
    autoScroll,
    children,
    startElement,
    endElement,
    itemsElement,
    previous,
    next,
    loading,
    onlyNext = false,
    onlyPrevious = false,
    ...props
  }, ref) => {
    var _a;
    const [startElementFromRef, setStartElementFromRef] = useState(null);
    const startElementRef = useCallback((node) => setStartElementFromRef(node), []);
    const [endElementFromRef, setEndElementFromRef] = useState(null);
    const endElementRef = useCallback((node) => setEndElementFromRef(node), []);
    const [itemsElementFromRef, setItemsElementFromRef] = useState(null);
    const itemsElementRef = useCallback((node) => setItemsElementFromRef(node), []);
    const scrollProp = (_a = usePage().scrollProps) == null ? void 0 : _a[data];
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [loadingNext, setLoadingNext] = useState(false);
    const [requestCount, setRequestCount] = useState(0);
    const [hasPreviousPage, setHasPreviousPage] = useState(!!(scrollProp == null ? void 0 : scrollProp.previousPage));
    const [hasNextPage, setHasNextPage] = useState(!!(scrollProp == null ? void 0 : scrollProp.nextPage));
    const [resolvedStartElement, setResolvedStartElement] = useState(null);
    const [resolvedEndElement, setResolvedEndElement] = useState(null);
    const [resolvedItemsElement, setResolvedItemsElement] = useState(null);
    useEffect(() => {
      const element = startElement ? resolveHTMLElement(startElement, startElementFromRef) : startElementFromRef;
      setResolvedStartElement(element);
    }, [startElement, startElementFromRef]);
    useEffect(() => {
      const element = endElement ? resolveHTMLElement(endElement, endElementFromRef) : endElementFromRef;
      setResolvedEndElement(element);
    }, [endElement, endElementFromRef]);
    useEffect(() => {
      const element = itemsElement ? resolveHTMLElement(itemsElement, itemsElementFromRef) : itemsElementFromRef;
      setResolvedItemsElement(element);
    }, [itemsElement, itemsElementFromRef]);
    const scrollableParent = useMemo(() => getScrollableParent(resolvedItemsElement), [resolvedItemsElement]);
    const callbackPropsRef = useRef({
      buffer,
      onlyNext,
      onlyPrevious,
      reverse,
      preserveUrl
    });
    callbackPropsRef.current = {
      buffer,
      onlyNext,
      onlyPrevious,
      reverse,
      preserveUrl
    };
    const [infiniteScroll, setInfiniteScroll] = useState(null);
    const dataManager = useMemo(() => infiniteScroll == null ? void 0 : infiniteScroll.dataManager, [infiniteScroll]);
    const elementManager = useMemo(() => infiniteScroll == null ? void 0 : infiniteScroll.elementManager, [infiniteScroll]);
    const scrollToBottom = useCallback(() => {
      if (scrollableParent) {
        scrollableParent.scrollTo({
          top: scrollableParent.scrollHeight,
          behavior: "instant"
        });
      } else {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "instant"
        });
      }
    }, [scrollableParent]);
    useEffect(() => {
      if (!resolvedItemsElement) {
        return;
      }
      function syncStateFromDataManager() {
        setRequestCount(infiniteScrollInstance.dataManager.getRequestCount());
        setHasPreviousPage(infiniteScrollInstance.dataManager.hasPrevious());
        setHasNextPage(infiniteScrollInstance.dataManager.hasNext());
      }
      const infiniteScrollInstance = useInfiniteScroll({
        // Data
        getPropName: () => data,
        inReverseMode: () => callbackPropsRef.current.reverse,
        shouldFetchNext: () => !callbackPropsRef.current.onlyPrevious,
        shouldFetchPrevious: () => !callbackPropsRef.current.onlyNext,
        shouldPreserveUrl: () => callbackPropsRef.current.preserveUrl,
        // Elements
        getTriggerMargin: () => callbackPropsRef.current.buffer,
        getStartElement: () => resolvedStartElement,
        getEndElement: () => resolvedEndElement,
        getItemsElement: () => resolvedItemsElement,
        getScrollableParent: () => scrollableParent,
        // Callbacks
        onBeforePreviousRequest: () => setLoadingPrevious(true),
        onBeforeNextRequest: () => setLoadingNext(true),
        onCompletePreviousRequest: ({ completed }) => {
          setLoadingPrevious(false);
          if (completed) {
            syncStateFromDataManager();
          }
        },
        onCompleteNextRequest: ({ completed }) => {
          setLoadingNext(false);
          if (completed) {
            syncStateFromDataManager();
          }
        },
        onDataReset: syncStateFromDataManager
      });
      setInfiniteScroll(infiniteScrollInstance);
      const { dataManager: dataManager2, elementManager: elementManager2 } = infiniteScrollInstance;
      syncStateFromDataManager();
      elementManager2.setupObservers();
      elementManager2.processServerLoadedElements(dataManager2.getLastLoadedPage());
      if (autoLoad) {
        elementManager2.enableTriggers();
      }
      return () => {
        infiniteScrollInstance.flush();
        setInfiniteScroll(null);
      };
    }, [data, resolvedItemsElement, resolvedStartElement, resolvedEndElement, scrollableParent]);
    const manualMode = useMemo(
      () => manual || manualAfter > 0 && requestCount >= manualAfter,
      [manual, manualAfter, requestCount]
    );
    const autoLoad = useMemo(() => !manualMode, [manualMode]);
    useEffect(() => {
      autoLoad ? elementManager == null ? void 0 : elementManager.enableTriggers() : elementManager == null ? void 0 : elementManager.disableTriggers();
    }, [autoLoad, onlyNext, onlyPrevious, resolvedStartElement, resolvedEndElement]);
    useEffect(() => {
      const shouldAutoScroll = autoScroll !== void 0 ? autoScroll : reverse;
      if (shouldAutoScroll) {
        scrollToBottom();
      }
    }, [scrollableParent]);
    useImperativeHandle(
      ref,
      () => ({
        fetchNext: (dataManager == null ? void 0 : dataManager.fetchNext) || (() => {
        }),
        fetchPrevious: (dataManager == null ? void 0 : dataManager.fetchPrevious) || (() => {
        }),
        hasPrevious: (dataManager == null ? void 0 : dataManager.hasPrevious) || (() => false),
        hasNext: (dataManager == null ? void 0 : dataManager.hasNext) || (() => false)
      }),
      [dataManager]
    );
    const headerAutoMode = autoLoad && !onlyNext;
    const footerAutoMode = autoLoad && !onlyPrevious;
    const sharedExposed = {
      loadingPrevious,
      loadingNext,
      hasPrevious: hasPreviousPage,
      hasNext: hasNextPage
    };
    const exposedPrevious = {
      loading: loadingPrevious,
      fetch: (dataManager == null ? void 0 : dataManager.fetchPrevious) ?? (() => {
      }),
      autoMode: headerAutoMode,
      manualMode: !headerAutoMode,
      hasMore: hasPreviousPage,
      ...sharedExposed
    };
    const exposedNext = {
      loading: loadingNext,
      fetch: (dataManager == null ? void 0 : dataManager.fetchNext) ?? (() => {
      }),
      autoMode: footerAutoMode,
      manualMode: !footerAutoMode,
      hasMore: hasNextPage,
      ...sharedExposed
    };
    const exposedSlot = {
      loading: loadingPrevious || loadingNext,
      loadingPrevious,
      loadingNext
    };
    const renderElements = [];
    if (!startElement) {
      renderElements.push(
        createElement(
          "div",
          { ref: startElementRef },
          // Render previous slot or fallback to loading indicator
          renderSlot(previous, exposedPrevious, loadingPrevious ? renderSlot(loading, exposedPrevious) : null)
        )
      );
    }
    renderElements.push(
      createElement(
        as,
        { ...props, ref: itemsElementRef },
        typeof children === "function" ? children(exposedSlot) : children
      )
    );
    if (!endElement) {
      renderElements.push(
        createElement(
          "div",
          { ref: endElementRef },
          // Render next slot or fallback to loading indicator
          renderSlot(next, exposedNext, loadingNext ? renderSlot(loading, exposedNext) : null)
        )
      );
    }
    return createElement(React.Fragment, {}, ...reverse ? [...renderElements].reverse() : renderElements);
  }
);
InfiniteScroll.displayName = "InertiaInfiniteScroll";
var noop2 = () => void 0;
var Link = forwardRef(
  ({
    children,
    as = "a",
    data = {},
    href = "",
    method = "get",
    preserveScroll = false,
    preserveState = null,
    preserveUrl = false,
    replace = false,
    only = [],
    except = [],
    headers = {},
    queryStringArrayFormat = "brackets",
    async = false,
    onClick = noop2,
    onCancelToken = noop2,
    onBefore = noop2,
    onStart = noop2,
    onProgress = noop2,
    onFinish = noop2,
    onCancel = noop2,
    onSuccess = noop2,
    onError = noop2,
    onPrefetching = noop2,
    onPrefetched = noop2,
    prefetch = false,
    cacheFor = 0,
    cacheTags = [],
    viewTransition = false,
    ...props
  }, ref) => {
    const [inFlightCount, setInFlightCount] = useState(0);
    const hoverTimeout = useRef(void 0);
    const _method = useMemo(() => {
      return isUrlMethodPair(href) ? href.method : method.toLowerCase();
    }, [href, method]);
    const _as = useMemo(() => {
      if (typeof as !== "string" || as.toLowerCase() !== "a") {
        return as;
      }
      return _method !== "get" ? "button" : as.toLowerCase();
    }, [as, _method]);
    const mergeDataArray = useMemo(
      () => mergeDataIntoQueryString(_method, isUrlMethodPair(href) ? href.url : href, data, queryStringArrayFormat),
      [href, _method, data, queryStringArrayFormat]
    );
    const url = useMemo(() => mergeDataArray[0], [mergeDataArray]);
    const _data = useMemo(() => mergeDataArray[1], [mergeDataArray]);
    const baseParams = useMemo(
      () => ({
        data: _data,
        method: _method,
        preserveScroll,
        preserveState: preserveState ?? _method !== "get",
        preserveUrl,
        replace,
        only,
        except,
        headers,
        async
      }),
      [_data, _method, preserveScroll, preserveState, preserveUrl, replace, only, except, headers, async]
    );
    const visitParams = useMemo(
      () => ({
        ...baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart(visit) {
          setInFlightCount((count) => count + 1);
          onStart(visit);
        },
        onProgress,
        onFinish(visit) {
          setInFlightCount((count) => count - 1);
          onFinish(visit);
        },
        onCancel,
        onSuccess,
        onError
      }),
      [
        baseParams,
        viewTransition,
        onCancelToken,
        onBefore,
        onStart,
        onProgress,
        onFinish,
        onCancel,
        onSuccess,
        onError
      ]
    );
    const prefetchModes = useMemo(
      () => {
        if (prefetch === true) {
          return ["hover"];
        }
        if (prefetch === false) {
          return [];
        }
        if (Array.isArray(prefetch)) {
          return prefetch;
        }
        return [prefetch];
      },
      Array.isArray(prefetch) ? prefetch : [prefetch]
    );
    const cacheForValue = useMemo(() => {
      if (cacheFor !== 0) {
        return cacheFor;
      }
      if (prefetchModes.length === 1 && prefetchModes[0] === "click") {
        return 0;
      }
      return config.get("prefetch.cacheFor");
    }, [cacheFor, prefetchModes]);
    const doPrefetch = useMemo(() => {
      return () => {
        router.prefetch(
          url,
          {
            ...baseParams,
            onPrefetching,
            onPrefetched
          },
          { cacheFor: cacheForValue, cacheTags }
        );
      };
    }, [url, baseParams, onPrefetching, onPrefetched, cacheForValue, cacheTags]);
    useEffect(() => {
      return () => {
        clearTimeout(hoverTimeout.current);
      };
    }, []);
    useEffect(() => {
      if (prefetchModes.includes("mount")) {
        setTimeout(() => doPrefetch());
      }
    }, prefetchModes);
    const regularEvents = {
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      }
    };
    const prefetchHoverEvents = {
      onMouseEnter: () => {
        hoverTimeout.current = window.setTimeout(() => {
          doPrefetch();
        }, config.get("prefetch.hoverDelay"));
      },
      onMouseLeave: () => {
        clearTimeout(hoverTimeout.current);
      },
      onClick: regularEvents.onClick
    };
    const prefetchClickEvents = {
      onMouseDown: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onKeyDown: (event) => {
        if (shouldNavigate(event)) {
          event.preventDefault();
          doPrefetch();
        }
      },
      onMouseUp: (event) => {
        if (shouldIntercept(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      },
      onKeyUp: (event) => {
        if (shouldNavigate(event)) {
          event.preventDefault();
          router.visit(url, visitParams);
        }
      },
      onClick: (event) => {
        onClick(event);
        if (shouldIntercept(event)) {
          event.preventDefault();
        }
      }
    };
    const elProps = useMemo(() => {
      if (_as === "button") {
        return { type: "button" };
      }
      if (_as === "a" || typeof _as !== "string") {
        return { href: url };
      }
      return {};
    }, [_as, url]);
    return createElement(
      _as,
      {
        ...props,
        ...elProps,
        ref,
        ...(() => {
          if (prefetchModes.includes("hover")) {
            return prefetchHoverEvents;
          }
          if (prefetchModes.includes("click")) {
            return prefetchClickEvents;
          }
          return regularEvents;
        })(),
        "data-loading": inFlightCount > 0 ? "" : void 0
      },
      children
    );
  }
);
Link.displayName = "InertiaLink";
var Link_default = Link;
var router3 = router;
var config = config$1.extend();
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
createServer(
  (page) => createInertiaApp({
    page,
    title: (title) => title ? `${title} — MILLIONAIRE` : "MILLIONAIRE — Wear Your Status",
    render: ReactDOMServer.renderToString,
    resolve: (name) => resolvePageComponent(
      `./Pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./Pages/Account/Index.tsx": () => import("./assets/Index-CcWZ6dR4.js"), "./Pages/Account/Loyalty.tsx": () => import("./assets/Loyalty-CAfy6S_z.js"), "./Pages/Account/OrderDetail.tsx": () => import("./assets/OrderDetail-4lTGAusn.js"), "./Pages/Account/Orders.tsx": () => import("./assets/Orders-Bes7X9E6.js"), "./Pages/Account/Partials/AccountSidebar.tsx": () => import("./assets/AccountSidebar-BdWTWjTn.js"), "./Pages/Account/Profile.tsx": () => import("./assets/Profile-CTdxyALs.js"), "./Pages/Account/TailorOrders.tsx": () => import("./assets/TailorOrders-DB8vT7Ke.js"), "./Pages/Account/Wishlist.tsx": () => import("./assets/Wishlist-B2XUwBIa.js"), "./Pages/Admin/Analytics/Index.tsx": () => import("./assets/Index-BTjqs0jI.js"), "./Pages/Admin/Backup/Index.tsx": () => import("./assets/Index-sN69vHKD.js"), "./Pages/Admin/Banners/Index.tsx": () => import("./assets/Index-gVwDFrom.js"), "./Pages/Admin/BlockedIps/Index.tsx": () => import("./assets/Index-L5qP7cgB.js"), "./Pages/Admin/Branding/Index.tsx": () => import("./assets/Index-fKvgZLek.js"), "./Pages/Admin/Categories/Index.tsx": () => import("./assets/Index-DQoybFWs.js"), "./Pages/Admin/Coupons/Index.tsx": () => import("./assets/Index-6rSkQIpH.js"), "./Pages/Admin/Customers/Index.tsx": () => import("./assets/Index-BUVtEKFx.js"), "./Pages/Admin/Dashboard.tsx": () => import("./assets/Dashboard-CgubiSkd.js"), "./Pages/Admin/EmailCampaigns/Index.tsx": () => import("./assets/Index-C0Ko75eX.js"), "./Pages/Admin/Errors/NoPermission.tsx": () => import("./assets/NoPermission-DG3pbEtA.js"), "./Pages/Admin/HeroSlides/Index.tsx": () => import("./assets/Index-Bag9jREz.js"), "./Pages/Admin/Index.tsx": () => import("./assets/Index-ym4ez1_6.js"), "./Pages/Admin/Notifications/Index.tsx": () => import("./assets/Index-CpbvttKQ.js"), "./Pages/Admin/Orders/Create.tsx": () => import("./assets/Create-CdpTGXw3.js"), "./Pages/Admin/Orders/Index.tsx": () => import("./assets/Index-DMrvCA-J.js"), "./Pages/Admin/Orders/Lookup.tsx": () => import("./assets/Lookup-BFjMGg35.js"), "./Pages/Admin/Orders/Show.tsx": () => import("./assets/Show-BUMxCD8q.js"), "./Pages/Admin/Pages/Index.tsx": () => import("./assets/Index-B1Wov5-o.js"), "./Pages/Admin/Payments/Index.tsx": () => import("./assets/Index-DggH8frH.js"), "./Pages/Admin/Products/Edit.tsx": () => import("./assets/Edit-PURDd_Rq.js"), "./Pages/Admin/Products/Index.tsx": () => import("./assets/Index-C6-lsMOz.js"), "./Pages/Admin/Profile.tsx": () => import("./assets/Profile-CoOUPFGF.js"), "./Pages/Admin/PromoVideo/Index.tsx": () => import("./assets/Index-CgsfRPia.js"), "./Pages/Admin/Reports/Index.tsx": () => import("./assets/Index-2FpMqx-A.js"), "./Pages/Admin/Returns/Index.tsx": () => import("./assets/Index-DvXavRCV.js"), "./Pages/Admin/Reviews/Index.tsx": () => import("./assets/Index-Dp__jKUf.js"), "./Pages/Admin/Seo/Index.tsx": () => import("./assets/Index-lV7SIHlE.js"), "./Pages/Admin/Settings.tsx": () => import("./assets/Settings-xNujExns.js"), "./Pages/Admin/Staff/Index.tsx": () => import("./assets/Index-CTBhcIgZ.js"), "./Pages/Admin/Support/Index.tsx": () => import("./assets/Index-CY82Ni7s.js"), "./Pages/Admin/Support/Show.tsx": () => import("./assets/Show-BogB31M8.js"), "./Pages/Admin/SystemLogs/Index.tsx": () => import("./assets/Index-CKOpcg-O.js"), "./Pages/Admin/Theme/Index.tsx": () => import("./assets/Index-D1pdk0gp.js"), "./Pages/Admin/WhatsApp/Index.tsx": () => import("./assets/Index-aTMs2TY5.js"), "./Pages/Auth/Login.tsx": () => import("./assets/Login-BLgNYHxQ.js"), "./Pages/Auth/Register.tsx": () => import("./assets/Register-CzT_F7Q6.js"), "./Pages/Home.tsx": () => import("./assets/Home-D5EIOpFp.js"), "./Pages/Info/About.tsx": () => import("./assets/About-D5DNQb11.js"), "./Pages/Info/Contact.tsx": () => import("./assets/Contact-BDga7Heo.js"), "./Pages/Info/Policy.tsx": () => import("./assets/Policy-CIwCie6u.js"), "./Pages/Shop/Cart.tsx": () => import("./assets/Cart-DE1z6T0c.js"), "./Pages/Shop/CategoryLanding.tsx": () => import("./assets/CategoryLanding-zyZGbuSb.js"), "./Pages/Shop/Index.tsx": () => import("./assets/Index-0v88EmS9.js"), "./Pages/Shop/OrderConfirmation.tsx": () => import("./assets/OrderConfirmation-CLurca2a.js"), "./Pages/Shop/OrderConfirmed.tsx": () => import("./assets/OrderConfirmed-V5FKHq2A.js"), "./Pages/Shop/PayFastRedirect.tsx": () => import("./assets/PayFastRedirect-D9pTVs3c.js"), "./Pages/Shop/PaymentFailed.tsx": () => import("./assets/PaymentFailed-C-CLb2aJ.js"), "./Pages/Shop/Show.tsx": () => import("./assets/Show-JImKhAKM.js"), "./Pages/Shop/Support.tsx": () => import("./assets/Support-Hzo5JYK8.js"), "./Pages/Shop/TrackOrder.tsx": () => import("./assets/TrackOrder-6YIwz-Oh.js"), "./Pages/Shop/Wishlist.tsx": () => import("./assets/Wishlist-DAOUyMXy.js") })
    ),
    setup: ({ App: App2, props }) => /* @__PURE__ */ jsx(App2, { ...props })
  })
);
export {
  Head_default as H,
  Link_default as L,
  useForm as a,
  router3 as r,
  usePage as u
};
