/* @ds-bundle: {"format":4,"namespace":"PeppyDesignSystem_1996eb","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"DataTable","sourcePath":"components/data/DataTable.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"},{"name":"Modal","sourcePath":"components/feedback/Modal.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"TextInput","sourcePath":"components/forms/TextInput.jsx"},{"name":"Band","sourcePath":"components/layout/Band.jsx"},{"name":"Eyebrow","sourcePath":"components/layout/Eyebrow.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"NavLink","sourcePath":"components/navigation/NavBar.jsx"},{"name":"SidebarNavRow","sourcePath":"components/navigation/SidebarNavRow.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"CategoryCard","sourcePath":"components/surfaces/CategoryCard.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"bcd743ef4f4f","components/actions/IconButton.jsx":"1edbe26abbd6","components/data/Badge.jsx":"02eb28cc14a2","components/data/DataTable.jsx":"35f3a428d409","components/feedback/EmptyState.jsx":"b85acc16764f","components/feedback/Modal.jsx":"f3ca2937108e","components/feedback/Toast.jsx":"1926746e461c","components/forms/TextInput.jsx":"c41fabe5b1cf","components/layout/Band.jsx":"485b89d5960f","components/layout/Eyebrow.jsx":"831976b6d321","components/navigation/Footer.jsx":"7729b6c454e8","components/navigation/NavBar.jsx":"45e90cd5197b","components/navigation/SidebarNavRow.jsx":"ee8d58340e0d","components/surfaces/Card.jsx":"fe162ca0e9c8","components/surfaces/CategoryCard.jsx":"d92591875fe6","ui_kits/app/Screens.jsx":"13ae42d1e273","ui_kits/app/Sidebar.jsx":"7599783f6537","ui_kits/app/SignIn.jsx":"1ba95987267c","ui_kits/marketing/Chrome.jsx":"d19e4633ef2a","ui_kits/marketing/Home.jsx":"c353ab325856","ui_kits/marketing/Library.jsx":"28c80cf5a6c9","ui_kits/marketing/Pricing.jsx":"dd2e881e9738"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PeppyDesignSystem_1996eb = window.PeppyDesignSystem_1996eb || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-button-size)",
  lineHeight: "var(--text-button-line)",
  letterSpacing: "var(--text-button-track)",
  fontWeight: "var(--text-button-weight)",
  borderRadius: "var(--radius-button)",
  padding: "var(--space-md) var(--space-xl)",
  border: "1px solid transparent",
  display: "inline-flex",
  alignItems: "center",
  gap: "var(--space-sm)",
  cursor: "pointer",
  textDecoration: "none",
  transition: "background-color var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard)"
};
const variants = {
  primary: {
    background: "var(--action-primary-bg)",
    color: "var(--action-primary-fg)"
  },
  secondary: {
    background: "var(--action-secondary-bg)",
    color: "var(--action-secondary-fg)",
    borderColor: "var(--action-secondary-border)"
  },
  "text-arrow": {
    background: "transparent",
    color: "var(--ink)",
    padding: "var(--space-xl) 0",
    borderRadius: 0,
    textDecoration: "underline",
    textUnderlineOffset: "4px"
  }
};
const hovers = {
  primary: {
    background: "var(--action-primary-bg-hover)"
  },
  secondary: {
    background: "var(--action-secondary-bg-hover)"
  },
  "text-arrow": {
    color: "var(--body-mid)"
  }
};
function Button({
  variant = "primary",
  disabled = false,
  fullWidth = false,
  href,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const v = variants[variant] || variants.primary;
  const s = {
    ...base,
    ...v,
    ...(hover && !disabled ? hovers[variant] : null),
    ...(press && !disabled && variant === "primary" ? {
      background: "var(--action-primary-bg-active)"
    } : null),
    ...(disabled ? {
      background: "var(--action-disabled-bg)",
      color: "var(--action-disabled-fg)",
      borderColor: "transparent",
      cursor: "not-allowed"
    } : null),
    ...(fullWidth ? {
      width: "100%",
      justifyContent: "center"
    } : null),
    ...style
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false)
  };
  const content = variant === "text-arrow" ? /*#__PURE__*/React.createElement(React.Fragment, null, children, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192")) : children;
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    style: s,
    onClick: onClick
  }, handlers, rest), content);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    style: s,
    disabled: disabled,
    onClick: disabled ? undefined : onClick
  }, handlers, rest), content);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  label,
  size = 40,
  tone = "default",
  disabled = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    default: {
      background: "var(--canvas)",
      color: "var(--ink)",
      border: "1px solid var(--hairline)"
    },
    ink: {
      background: "var(--primary)",
      color: "var(--on-primary)",
      border: "1px solid var(--primary)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)",
      border: "1px solid transparent"
    }
  };
  const s = {
    width: size,
    height: size,
    minWidth: size,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--radius-icon-button)",
    cursor: disabled ? "not-allowed" : "pointer",
    padding: "var(--space-sm)",
    transition: "background-color var(--duration-base) var(--ease-standard)",
    ...tones[tone],
    ...(hover && !disabled ? {
      background: tone === "ink" ? "var(--ink-strong)" : "var(--action-secondary-bg-hover)"
    } : null),
    ...(disabled ? {
      color: "var(--action-disabled-fg)",
      background: "var(--action-disabled-bg)",
      borderColor: "transparent"
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  info: {
    solid: "var(--status-info)",
    fg: "var(--on-primary)"
  },
  success: {
    solid: "var(--status-success)",
    fg: "var(--primary)"
  },
  warning: {
    solid: "var(--status-warning)",
    fg: "var(--primary)"
  },
  error: {
    solid: "var(--status-error)",
    fg: "var(--on-primary)"
  },
  neutral: {
    solid: "var(--primary)",
    fg: "var(--on-primary)"
  }
};
function Badge({
  tone = "info",
  soft = false,
  children,
  style,
  ...rest
}) {
  const t = tones[tone] || tones.info;
  const s = {
    display: "inline-flex",
    alignItems: "center",
    gap: "var(--space-xs)",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-caption-size)",
    lineHeight: "var(--text-caption-line)",
    fontWeight: "var(--text-caption-weight)",
    borderRadius: "var(--radius-badge)",
    padding: "var(--space-xs) var(--space-sm)",
    background: soft ? "var(--canvas)" : t.solid,
    color: soft ? t.solid : t.fg,
    border: soft ? "1px solid currentColor" : "1px solid transparent",
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: s
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/DataTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function DataTable({
  columns = [],
  rows = [],
  onRowClick,
  style,
  ...rest
}) {
  const th = {
    textAlign: "left",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-caption-size)",
    lineHeight: "var(--text-caption-line)",
    fontWeight: "var(--text-caption-weight)",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    background: "var(--canvas)",
    padding: "var(--space-md) var(--space-lg)",
    borderBottom: "1px solid var(--hairline)",
    whiteSpace: "nowrap"
  };
  const td = {
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-body-sm-size)",
    lineHeight: "var(--text-body-sm-line)",
    color: "var(--text-body)",
    padding: "var(--space-md) var(--space-lg)",
    borderBottom: "1px solid var(--hairline)"
  };
  return /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: "100%",
      borderCollapse: "collapse",
      background: "var(--canvas)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, columns.map((c, i) => /*#__PURE__*/React.createElement("th", {
    key: i,
    style: {
      ...th,
      textAlign: c.align || "left",
      width: c.width
    }
  }, c.header)))), /*#__PURE__*/React.createElement("tbody", null, rows.map((r, ri) => /*#__PURE__*/React.createElement("tr", {
    key: ri,
    onClick: onRowClick ? () => onRowClick(r, ri) : undefined,
    style: {
      cursor: onRowClick ? "pointer" : "default"
    }
  }, columns.map((c, ci) => /*#__PURE__*/React.createElement("td", {
    key: ci,
    style: {
      ...td,
      textAlign: c.align || "left"
    }
  }, c.render ? c.render(r) : r[c.key]))))));
}
Object.assign(__ds_scope, { DataTable });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/DataTable.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  title,
  description,
  action,
  icon,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-card)",
      padding: "var(--space-3xl)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--space-md)",
      textAlign: "center",
      boxSizing: "border-box",
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-muted)",
      display: "inline-flex"
    }
  }, icon) : null, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-display-xs-size)",
      lineHeight: "var(--text-display-xs-line)",
      fontWeight: "var(--text-display-xs-weight)",
      color: "var(--ink)"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-md-size)",
      lineHeight: "var(--text-body-md-line)",
      letterSpacing: "var(--text-body-md-track)",
      color: "var(--text-secondary)",
      margin: 0,
      maxWidth: 420
    }
  }, description) : null, action ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "var(--space-sm)"
    }
  }, action) : null);
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Modal.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Modal({
  open = true,
  title,
  description,
  onClose,
  footer,
  width = 480,
  children,
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(11,11,13,0.32)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-3xl)",
      zIndex: 50
    },
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    onClick: e => e.stopPropagation(),
    style: {
      background: "var(--canvas)",
      color: "var(--ink)",
      borderRadius: "var(--radius-card)",
      padding: "var(--space-3xl)",
      boxShadow: "var(--elevation-4)",
      width,
      maxWidth: "100%",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)",
      ...style
    }
  }, rest), title ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-display-sm-size)",
      lineHeight: "var(--text-display-sm-line)",
      fontWeight: "var(--text-display-sm-weight)"
    }
  }, title) : null, description ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-md-size)",
      lineHeight: "var(--text-body-md-line)",
      letterSpacing: "var(--text-body-md-track)",
      color: "var(--text-body)",
      margin: 0
    }
  }, description) : null, children, footer ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-md)",
      justifyContent: "flex-end",
      marginTop: "var(--space-sm)"
    }
  }, footer) : null));
}
Object.assign(__ds_scope, { Modal });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Modal.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const dots = {
  info: "var(--status-info)",
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  error: "var(--status-error)"
};
function Toast({
  tone = "info",
  title,
  message,
  action,
  onDismiss,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: "var(--space-md)",
      background: "var(--canvas)",
      color: "var(--ink)",
      borderRadius: "var(--radius-card)",
      border: "1px solid var(--hairline)",
      padding: "var(--space-md) var(--space-lg)",
      boxShadow: "var(--elevation-3)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      minWidth: 320,
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "var(--radius-full)",
      background: dots[tone] || dots.info,
      marginTop: 7,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--text-body-sm-strong-weight)"
    }
  }, title) : null, message ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-secondary)"
    }
  }, message) : null), action, onDismiss ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      background: "none",
      border: "none",
      color: "var(--text-muted)",
      cursor: "pointer",
      fontSize: 14,
      lineHeight: 1,
      padding: 2
    }
  }, "\u2715") : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TextInput({
  label,
  hint,
  error,
  id,
  type = "text",
  disabled = false,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const s = {
    width: "100%",
    boxSizing: "border-box",
    background: "var(--canvas)",
    color: "var(--ink)",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-body-md-size)",
    lineHeight: "var(--text-body-md-line)",
    letterSpacing: "var(--text-body-md-track)",
    border: "1px solid " + (error ? "var(--status-error)" : focus ? "var(--ink)" : "var(--hairline)"),
    borderRadius: "var(--radius-input)",
    padding: "var(--space-md) var(--space-lg)",
    outline: "none",
    transition: "border-color var(--duration-base) var(--ease-standard)",
    ...(disabled ? {
      background: "var(--action-disabled-bg)",
      color: "var(--action-disabled-fg)"
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, label ? /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      fontWeight: "var(--text-body-sm-strong-weight)",
      color: "var(--ink)"
    }
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    disabled: disabled,
    style: s,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, rest)), error || hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      color: error ? "var(--status-error)" : "var(--text-muted)"
    }
  }, error || hint) : null);
}
Object.assign(__ds_scope, { TextInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextInput.jsx", error: String((e && e.message) || e) }); }

// components/layout/Band.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Band({
  tone = "canvas",
  size = "content",
  eyebrow,
  title,
  lead,
  actions,
  children,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  const titleScale = size === "hero" ? {
    fontSize: "var(--text-display-xxl-size)",
    lineHeight: "var(--text-display-xxl-line)",
    letterSpacing: "var(--text-display-xxl-track)",
    fontWeight: "var(--text-display-xxl-weight)"
  } : size === "sub" ? {
    fontSize: "var(--text-display-xl-size)",
    lineHeight: "var(--text-display-xl-line)",
    fontWeight: "var(--text-display-xl-weight)"
  } : {
    fontSize: "var(--text-display-lg-size)",
    lineHeight: "var(--text-display-lg-line)",
    fontWeight: "var(--text-display-lg-weight)"
  };
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      background: dark ? "var(--surface-inverse)" : "var(--canvas)",
      color: dark ? "var(--text-on-dark)" : "var(--ink)",
      padding: "var(--band-vertical) var(--space-3xl)",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3xl)"
    }
  }, eyebrow || title || lead ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)",
      maxWidth: size === "hero" ? 900 : 760
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-eyebrow-size)",
      lineHeight: "var(--text-eyebrow-line)",
      letterSpacing: "var(--text-eyebrow-track)",
      fontWeight: "var(--text-eyebrow-weight)",
      textTransform: "uppercase",
      color: dark ? "var(--mute-soft)" : "var(--text-muted)"
    }
  }, eyebrow) : null, title ? /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-sans)",
      color: "inherit",
      margin: 0,
      textWrap: "pretty",
      ...titleScale
    }
  }, title) : null, lead ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: size === "hero" ? "var(--text-body-lg-size)" : "var(--text-body-md-size)",
      lineHeight: size === "hero" ? "var(--text-body-lg-line)" : "var(--text-body-md-line)",
      letterSpacing: size === "hero" ? "var(--text-body-lg-track)" : "var(--text-body-md-track)",
      color: dark ? "var(--mute-soft)" : "var(--text-body)",
      margin: 0,
      textWrap: "pretty"
    }
  }, lead) : null, actions ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-md)",
      flexWrap: "wrap",
      marginTop: "var(--space-sm)"
    }
  }, actions) : null) : null, children));
}
Object.assign(__ds_scope, { Band });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Band.jsx", error: String((e && e.message) || e) }); }

// components/layout/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Eyebrow({
  size = "md",
  children,
  style,
  ...rest
}) {
  const s = size === "sm" ? {
    fontSize: "var(--text-eyebrow-sm-size)",
    lineHeight: "var(--text-eyebrow-sm-line)",
    letterSpacing: "var(--text-eyebrow-sm-track)"
  } : {
    fontSize: "var(--text-eyebrow-size)",
    lineHeight: "var(--text-eyebrow-line)",
    letterSpacing: "var(--text-eyebrow-track)"
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--text-eyebrow-weight)",
      textTransform: "uppercase",
      color: "var(--text-muted)",
      ...s,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Footer({
  brand = "Peppy",
  tagline,
  columns = [],
  legal,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: "var(--canvas)",
      color: "var(--text-secondary)",
      padding: "var(--space-3xl)",
      borderTop: "1px solid var(--hairline)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      boxSizing: "border-box",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "64px",
      flexWrap: "wrap",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)",
      maxWidth: 280
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-xs-size)",
      lineHeight: "var(--text-display-xs-line)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "-0.4px",
      color: "var(--ink)"
    }
  }, brand), tagline ? /*#__PURE__*/React.createElement("span", null, tagline) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "64px",
      flexWrap: "wrap"
    }
  }, columns.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-eyebrow-sm-size)",
      lineHeight: "var(--text-eyebrow-sm-line)",
      letterSpacing: "var(--text-eyebrow-sm-track)",
      fontWeight: "var(--text-eyebrow-sm-weight)",
      textTransform: "uppercase",
      color: "var(--ink)"
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, (c.links || []).map((l, j) => /*#__PURE__*/React.createElement("a", {
    key: j,
    href: l.href || "#",
    style: {
      color: "var(--text-secondary)",
      textDecoration: "none"
    }
  }, l.label))))))), legal ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "48px",
      paddingTop: "var(--space-2xl)",
      borderTop: "1px solid var(--hairline)",
      color: "var(--text-muted)"
    }
  }, legal) : null);
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function NavBar({
  brand = "Peppy",
  links = [],
  actions,
  sticky = true,
  style,
  ...rest
}) {
  const s = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--space-3xl)",
    background: "var(--canvas)",
    color: "var(--ink)",
    padding: "var(--space-lg) var(--space-3xl)",
    borderBottom: "1px solid var(--hairline)",
    position: sticky ? "sticky" : "static",
    top: 0,
    zIndex: 20,
    boxSizing: "border-box",
    ...style
  };
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: s
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-display-xs-size)",
      lineHeight: "var(--text-display-xs-line)",
      fontWeight: "var(--weight-semibold)",
      letterSpacing: "-0.4px",
      color: "var(--ink)"
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-3xl)"
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement(NavLink, _extends({
    key: i
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-md)"
    }
  }, actions));
}
function NavLink({
  label,
  href = "#",
  active = false,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      fontWeight: "var(--text-body-sm-strong-weight)",
      color: active ? "var(--ink)" : hover ? "var(--ink)" : "var(--body)",
      textDecoration: "none",
      borderBottom: active ? "1px solid var(--ink)" : "1px solid transparent",
      paddingBottom: 2,
      transition: "color var(--duration-base) var(--ease-standard)"
    }
  }, label);
}
Object.assign(__ds_scope, { NavBar, NavLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SidebarNavRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function SidebarNavRow({
  label,
  icon,
  active = false,
  badge,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-md)",
      width: "100%",
      textAlign: "left",
      background: active ? "#f2f2f3" : hover ? "#f7f7f8" : "transparent",
      color: active ? "var(--ink)" : "var(--body)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      fontWeight: active ? "var(--text-body-sm-strong-weight)" : "var(--text-body-sm-weight)",
      border: "none",
      borderLeft: "2px solid " + (active ? "var(--primary)" : "transparent"),
      borderRadius: "var(--radius-sm)",
      padding: "var(--space-md) var(--space-lg)",
      cursor: "pointer",
      transition: "background-color var(--duration-fast) var(--ease-standard)",
      ...style
    }
  }, rest), icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      width: 16,
      height: 16,
      alignItems: "center",
      justifyContent: "center"
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, label), badge != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-caption-size)",
      fontWeight: "var(--text-caption-weight)",
      color: "var(--text-muted)"
    }
  }, badge) : null);
}
Object.assign(__ds_scope, { SidebarNavRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SidebarNavRow.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const elevations = {
  0: "none",
  1: "none",
  2: "var(--elevation-2)",
  3: "var(--elevation-3)",
  4: "var(--elevation-4)"
};
function Card({
  tone = "canvas",
  elevation = 1,
  padding,
  children,
  style,
  ...rest
}) {
  const dark = tone === "dark";
  const s = {
    background: dark ? "var(--surface-card-dark)" : "var(--surface-card)",
    color: dark ? "var(--text-on-dark)" : "var(--ink)",
    border: dark || elevation === 0 ? "1px solid transparent" : "1px solid var(--hairline)",
    borderRadius: "var(--radius-card)",
    padding: padding || "var(--space-3xl)",
    boxShadow: elevations[elevation] || "none",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--text-body-md-size)",
    lineHeight: "var(--text-body-md-line)",
    letterSpacing: "var(--text-body-md-track)",
    boxSizing: "border-box",
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: s
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/CategoryCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const fills = {
  purple: {
    background: "var(--category-purple)",
    color: "var(--category-fg-light)"
  },
  pink: {
    background: "var(--category-pink)",
    color: "var(--category-fg-light)"
  },
  blue: {
    background: "var(--category-blue)",
    color: "var(--category-fg-light)"
  },
  orange: {
    background: "var(--category-orange)",
    color: "var(--category-fg-light)"
  },
  green: {
    background: "var(--category-green)",
    color: "var(--category-fg-dark)"
  }
};
function CategoryCard({
  color = "purple",
  eyebrow,
  title,
  meta,
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const fill = fills[color] || fills.purple;
  const s = {
    ...fill,
    borderRadius: "var(--radius-card)",
    padding: "var(--space-3xl)",
    minHeight: 220,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "var(--space-3xl)",
    textDecoration: "none",
    boxSizing: "border-box",
    transform: hover && href ? "translateY(-2px)" : "none",
    boxShadow: hover && href ? "var(--elevation-2)" : "none",
    transition: "transform var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard)",
    ...style
  };
  const Tag = href ? "a" : "div";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-eyebrow-sm-size)",
      lineHeight: "var(--text-eyebrow-sm-line)",
      letterSpacing: "var(--text-eyebrow-sm-track)",
      fontWeight: "var(--text-eyebrow-sm-weight)",
      textTransform: "uppercase",
      opacity: 0.8
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, title ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-display-md-size)",
      lineHeight: "var(--text-display-md-line)",
      fontWeight: "var(--text-display-md-weight)",
      color: "inherit"
    }
  }, title) : null, children, meta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      opacity: 0.85
    }
  }, meta) : null));
}
Object.assign(__ds_scope, { CategoryCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/CategoryCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Screens.jsx
try { (() => {
const {
  Card,
  DataTable,
  Badge,
  Button,
  Eyebrow,
  EmptyState,
  IconButton
} = window.PeppyDesignSystem_1996eb;
function PageHeader({
  title,
  description,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: "var(--space-2xl)",
      padding: "var(--space-3xl) var(--space-3xl) var(--space-2xl)",
      borderBottom: "1px solid var(--hairline)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-sm-size)",
      lineHeight: "var(--text-display-sm-line)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, title), description ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: "var(--text-secondary)"
    }
  }, description) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-md)"
    }
  }, actions));
}
function Metric({
  label,
  value,
  delta,
  tone
}) {
  return /*#__PURE__*/React.createElement(Card, {
    padding: "var(--space-2xl)",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-md-size)",
      lineHeight: "var(--text-display-md-line)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, value), delta ? /*#__PURE__*/React.createElement(Badge, {
    tone: tone,
    soft: true
  }, delta) : null);
}
const WORKSPACES = [{
  name: "Northwind",
  owner: "A. Okafor",
  status: "Active",
  tone: "success",
  seats: 24,
  updated: "2 hours ago"
}, {
  name: "Bluebird",
  owner: "M. Lind",
  status: "Trial",
  tone: "warning",
  seats: 6,
  updated: "Yesterday"
}, {
  name: "Ravenous",
  owner: "S. Patel",
  status: "Failed",
  tone: "error",
  seats: 0,
  updated: "4 days ago"
}, {
  name: "Kestrel",
  owner: "J. Moreau",
  status: "Active",
  tone: "success",
  seats: 11,
  updated: "Last week"
}];
const MEMBERS = [{
  name: "Adaeze Okafor",
  email: "a.okafor@northwind.co",
  role: "Owner",
  status: "Active",
  tone: "success"
}, {
  name: "Marta Lind",
  email: "m.lind@northwind.co",
  role: "Admin",
  status: "Active",
  tone: "success"
}, {
  name: "Sanjay Patel",
  email: "s.patel@northwind.co",
  role: "Member",
  status: "Invited",
  tone: "info"
}];
function Overview({
  onInvite
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Overview",
    description: "Northwind \xB7 Team plan",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Export"), /*#__PURE__*/React.createElement(Button, {
      onClick: onInvite
    }, "Invite teammates"))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-3xl)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement(Metric, {
    label: "Active seats",
    value: "24",
    delta: "+3 this month",
    tone: "success"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Workspaces",
    value: "4"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Components in use",
    value: "16",
    delta: "Full coverage",
    tone: "info"
  }), /*#__PURE__*/React.createElement(Metric, {
    label: "Open invites",
    value: "1",
    delta: "Expires in 6 days",
    tone: "warning"
  })), /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "var(--space-lg) var(--space-lg) var(--space-lg) var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, "Workspaces"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Filter",
    size: 32
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "sliders-horizontal",
    style: {
      width: 16,
      height: 16
    }
  }))), /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: "name",
      header: "Workspace"
    }, {
      key: "owner",
      header: "Owner"
    }, {
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        soft: true
      }, r.status)
    }, {
      key: "updated",
      header: "Last activity"
    }, {
      key: "seats",
      header: "Seats",
      align: "right"
    }],
    rows: WORKSPACES
  }))));
}
function Workspaces() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Workspaces",
    description: "Every workspace under the Northwind organisation",
    actions: /*#__PURE__*/React.createElement(Button, null, "New workspace")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-3xl)",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-lg)"
    }
  }, WORKSPACES.map(w => /*#__PURE__*/React.createElement(Card, {
    key: w.name,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-xs-size)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, w.name), /*#__PURE__*/React.createElement(Badge, {
    tone: w.tone,
    soft: true
  }, w.status)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: "var(--text-secondary)"
    }
  }, w.owner, " \xB7 ", w.seats, " seats"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: "var(--text-muted)"
    }
  }, "Updated ", w.updated)))));
}
function Members({
  onInvite
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Members",
    description: "12 people have access to this organisation",
    actions: /*#__PURE__*/React.createElement(Button, {
      onClick: onInvite
    }, "Invite teammates")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-3xl)"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: "0",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    columns: [{
      key: "name",
      header: "Name"
    }, {
      key: "email",
      header: "Email"
    }, {
      key: "role",
      header: "Role"
    }, {
      header: "Status",
      render: r => /*#__PURE__*/React.createElement(Badge, {
        tone: r.tone,
        soft: true
      }, r.status)
    }],
    rows: MEMBERS
  }))));
}
function Billing() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Billing",
    description: "Team plan \xB7 renews 4 September 2026",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "secondary"
    }, "Download invoices")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "var(--space-3xl)"
    }
  }, /*#__PURE__*/React.createElement(EmptyState, {
    title: "No payment method on file",
    description: "Add a card before the trial ends so your workspaces stay active.",
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": "credit-card",
      style: {
        width: 24,
        height: 24
      }
    }),
    action: /*#__PURE__*/React.createElement(Button, null, "Add payment method"),
    style: {
      padding: "64px var(--space-3xl)"
    }
  })));
}
Object.assign(window, {
  Overview,
  Workspaces,
  Members,
  Billing,
  PageHeader,
  Metric,
  WORKSPACES,
  MEMBERS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Screens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Sidebar.jsx
try { (() => {
const {
  SidebarNavRow,
  Button,
  IconButton,
  Eyebrow
} = window.PeppyDesignSystem_1996eb;
const SECTIONS = [{
  key: "overview",
  label: "Overview",
  icon: "layout-dashboard"
}, {
  key: "workspaces",
  label: "Workspaces",
  icon: "folder",
  badge: "3"
}, {
  key: "members",
  label: "Members",
  icon: "users",
  badge: "12"
}, {
  key: "billing",
  label: "Billing",
  icon: "credit-card"
}];
function Sidebar({
  route,
  go
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flexShrink: 0,
      borderRight: "1px solid var(--hairline)",
      background: "var(--canvas)",
      padding: "var(--space-lg)",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-2xl)",
      height: "100%",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-xs-size)",
      fontWeight: 600,
      letterSpacing: "-0.4px",
      color: "var(--ink)"
    }
  }, "Peppy"), /*#__PURE__*/React.createElement(IconButton, {
    label: "Search",
    tone: "ghost",
    size: 32
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search",
    style: {
      width: 16,
      height: 16
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-xs)"
    }
  }, SECTIONS.map(s => /*#__PURE__*/React.createElement(SidebarNavRow, {
    key: s.key,
    label: s.label,
    badge: s.badge,
    active: route === s.key,
    onClick: () => go(s.key),
    icon: /*#__PURE__*/React.createElement("i", {
      "data-lucide": s.icon,
      style: {
        width: 16,
        height: 16
      }
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)",
      padding: "var(--space-lg)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-card)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, "Trial"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: "var(--text-body)"
    }
  }, "9 days left on the Team plan."), /*#__PURE__*/React.createElement(Button, {
    style: {
      padding: "var(--space-sm) var(--space-lg)",
      fontSize: "var(--text-body-sm-size)",
      justifyContent: "center"
    }
  }, "Upgrade")));
}
Object.assign(window, {
  Sidebar,
  SECTIONS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/SignIn.jsx
try { (() => {
const {
  Card,
  TextInput,
  Button,
  Eyebrow
} = window.PeppyDesignSystem_1996eb;
function SignIn({
  onSignIn
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--canvas)",
      padding: "var(--space-3xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 420,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-3xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-sm-size)",
      fontWeight: 600,
      letterSpacing: "-0.4px",
      color: "var(--ink)"
    }
  }, "Peppy"), /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, "Console")), /*#__PURE__*/React.createElement(Card, {
    elevation: 2,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-xs-size)",
      lineHeight: "var(--text-display-xs-line)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, "Sign in to your workspace"), /*#__PURE__*/React.createElement(TextInput, {
    label: "Work email",
    placeholder: "you@company.com",
    defaultValue: "a.okafor@northwind.co"
  }), /*#__PURE__*/React.createElement(TextInput, {
    label: "Password",
    type: "password",
    defaultValue: "password"
  }), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    onClick: onSignIn
  }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onSignIn
  }, "Use single sign-on"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: "var(--text-muted)",
      textAlign: "center"
    }
  }, "Forgot your password? ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Reset it")))));
}
Object.assign(window, {
  SignIn
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/SignIn.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Chrome.jsx
try { (() => {
const {
  NavBar,
  Footer,
  Button
} = window.PeppyDesignSystem_1996eb;
const NAV_LINKS = [{
  label: "Product",
  key: "home"
}, {
  label: "Library",
  key: "library"
}, {
  label: "Pricing",
  key: "pricing"
}];
function SiteNav({
  route,
  go
}) {
  return /*#__PURE__*/React.createElement(NavBar, {
    brand: "Peppy",
    links: NAV_LINKS.map(l => ({
      label: l.label,
      href: "#",
      active: route === l.key,
      onClick: e => {
        e.preventDefault();
        go(l.key);
      }
    })),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => go("pricing")
    }, "Sign in"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => go("pricing")
    }, "Get started"))
  });
}
function SiteFooter() {
  return /*#__PURE__*/React.createElement(Footer, {
    brand: "Peppy",
    tagline: "A confident, professional design language for teams that ship interfaces every week.",
    columns: [{
      title: "Product",
      links: [{
        label: "Overview"
      }, {
        label: "Library"
      }, {
        label: "Pricing"
      }, {
        label: "Changelog"
      }]
    }, {
      title: "Resources",
      links: [{
        label: "Documentation"
      }, {
        label: "Guides"
      }, {
        label: "Support"
      }]
    }, {
      title: "Company",
      links: [{
        label: "About"
      }, {
        label: "Careers"
      }, {
        label: "Contact"
      }]
    }],
    legal: "\xA9 2026 Peppy. All rights reserved."
  });
}
Object.assign(window, {
  SiteNav,
  SiteFooter,
  NAV_LINKS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Home.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Band,
  Button,
  Card,
  CategoryCard,
  Badge,
  Eyebrow,
  TextInput
} = window.PeppyDesignSystem_1996eb;
const CATEGORIES = [{
  color: "purple",
  eyebrow: "Foundations",
  title: "Colour, type, spacing",
  meta: "18 tokens sets"
}, {
  color: "pink",
  eyebrow: "Patterns",
  title: "Forms and validation",
  meta: "24 patterns"
}, {
  color: "blue",
  eyebrow: "Components",
  title: "The primitive library",
  meta: "16 components"
}, {
  color: "orange",
  eyebrow: "Templates",
  title: "Full-page starting points",
  meta: "9 templates"
}, {
  color: "green",
  eyebrow: "Changelog",
  title: "What shipped this week",
  meta: "Updated Tuesdays"
}];
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Band, {
    size: "hero",
    eyebrow: "Design system",
    title: "Interfaces that look considered.",
    lead: "One near-black primary, five chromatic accents, one typeface. Peppy gives product teams a complete surface language without a single decision left open.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => go("pricing")
    }, "Get started"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => go("library")
    }, "Browse the library")),
    style: {
      paddingBottom: "48px"
    }
  }), /*#__PURE__*/React.createElement(Band, {
    style: {
      paddingTop: 0,
      paddingBottom: "48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    elevation: 2
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, "Primary"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-display-sm-size)",
      lineHeight: "var(--text-display-sm-line)",
      fontWeight: 500,
      color: "var(--ink)",
      margin: "var(--space-md) 0 var(--space-sm)"
    }
  }, "Two-colour conversion hierarchy"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-body)",
      margin: 0
    }
  }, "Near-black for every primary action, hairline-outlined white for everything adjacent. Nothing else competes.")), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, "Palette"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-display-sm-size)",
      lineHeight: "var(--text-display-sm-line)",
      fontWeight: 500,
      color: "var(--ink)",
      margin: "var(--space-md) 0 var(--space-sm)"
    }
  }, "Five chromatic stops"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--text-body)",
      margin: 0
    }
  }, "Purple, pink, blue, orange, green \u2014 each tied to one content category, used as full card fills."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      marginTop: "var(--space-lg)"
    }
  }, ["purple", "pink", "blue", "orange", "green"].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      width: 28,
      height: 28,
      borderRadius: "var(--radius-sm)",
      background: `var(--category-${c})`
    }
  })))), /*#__PURE__*/React.createElement(Card, {
    tone: "dark"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm",
    style: {
      color: "var(--mute-soft)"
    }
  }, "Type"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: "var(--text-display-sm-size)",
      lineHeight: "var(--text-display-sm-line)",
      fontWeight: 500,
      margin: "var(--space-md) 0 var(--space-sm)"
    }
  }, "Inter, capped at 600"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--mute-soft)",
      margin: 0
    }
  }, "Display sizes carry negative tracking; uppercase eyebrows mark every section. The system never goes heavier than semibold.")))), /*#__PURE__*/React.createElement(Band, {
    eyebrow: "What's inside",
    title: "Five categories, one language.",
    size: "content",
    style: {
      paddingTop: "48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-lg)"
    }
  }, CATEGORIES.map((c, i) => /*#__PURE__*/React.createElement(CategoryCard, _extends({
    key: c.color
  }, c, {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go("library");
    },
    style: i === 0 ? {
      gridColumn: "span 2",
      minHeight: 260
    } : null
  }))))), /*#__PURE__*/React.createElement(Band, {
    tone: "dark",
    eyebrow: "Adoption",
    title: "Teams ship faster when the surface is decided.",
    lead: "Peppy ships as tokens, React primitives and full-page templates. Point your product at one stylesheet and the decisions come with it.",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => go("pricing")
    }, "See pricing"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-3xl)",
      borderTop: "1px solid #2a2a2c",
      paddingTop: "var(--space-3xl)"
    }
  }, [["16", "primitives"], ["156", "design tokens"], ["4px", "button radius"], ["600", "weight ceiling"]].map(([n, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-xs)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-lg-size)",
      lineHeight: "var(--text-display-lg-line)",
      fontWeight: 600,
      color: "#fff"
    }
  }, n), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: "var(--mute-soft)"
    }
  }, l))))), /*#__PURE__*/React.createElement(Band, {
    eyebrow: "Stay current",
    title: "Changelog in your inbox, Tuesdays."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-md)",
      alignItems: "flex-end",
      maxWidth: 520
    }
  }, /*#__PURE__*/React.createElement(TextInput, {
    label: "Work email",
    placeholder: "you@company.com",
    style: {
      minWidth: 280
    }
  }), /*#__PURE__*/React.createElement(Button, null, "Subscribe"), /*#__PURE__*/React.createElement(Badge, {
    soft: true,
    style: {
      marginBottom: 14
    }
  }, "No spam"))));
}
Object.assign(window, {
  Home,
  CATEGORIES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Library.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Band,
  Card,
  CategoryCard,
  Badge,
  Button,
  Eyebrow,
  IconButton
} = window.PeppyDesignSystem_1996eb;
const ENTRIES = [{
  color: "purple",
  eyebrow: "Foundations",
  title: "Colour tokens",
  meta: "Base ramp + semantic aliases"
}, {
  color: "pink",
  eyebrow: "Patterns",
  title: "Form validation",
  meta: "Inline errors, hints, disabled"
}, {
  color: "blue",
  eyebrow: "Components",
  title: "Buttons & actions",
  meta: "Primary, secondary, text-arrow"
}, {
  color: "orange",
  eyebrow: "Templates",
  title: "Pricing page",
  meta: "3-up tier grid"
}, {
  color: "green",
  eyebrow: "Changelog",
  title: "Week of 4 August",
  meta: "6 changes"
}, {
  color: "purple",
  eyebrow: "Foundations",
  title: "Type scale",
  meta: "80px down to 12px"
}];
const ARTICLES = [{
  title: "Why the weight ceiling is 600",
  cat: "Foundations",
  read: "4 min",
  tone: "neutral"
}, {
  title: "Using the five-stop palette without breaking hierarchy",
  cat: "Patterns",
  read: "7 min",
  tone: "info"
}, {
  title: "Layered drop shadows, and when not to use them",
  cat: "Foundations",
  read: "5 min",
  tone: "neutral"
}];
function Library({
  filter,
  setFilter
}) {
  const tabs = ["All", "Foundations", "Patterns", "Components", "Templates", "Changelog"];
  const shown = filter === "All" ? ENTRIES : ENTRIES.filter(e => e.eyebrow === filter);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Band, {
    size: "sub",
    eyebrow: "Library",
    title: "Everything the system defines.",
    lead: "Browse by category. Each card opens the tokens, the component API and the do's and don'ts together.",
    style: {
      paddingBottom: "40px"
    }
  }), /*#__PURE__*/React.createElement(Band, {
    style: {
      paddingTop: 0,
      paddingBottom: "48px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "var(--space-sm)",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, tabs.map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    type: "button",
    onClick: () => setFilter(t),
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-body-sm-size)",
      fontWeight: 500,
      padding: "var(--space-sm) var(--space-lg)",
      borderRadius: "var(--radius-sm)",
      cursor: "pointer",
      background: filter === t ? "var(--primary)" : "var(--canvas)",
      color: filter === t ? "#fff" : "var(--ink)",
      border: "1px solid " + (filter === t ? "var(--primary)" : "var(--hairline)")
    }
  }, t)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Previous"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left",
    style: {
      width: 16,
      height: 16
    }
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Next",
    tone: "ink"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-right",
    style: {
      width: 16,
      height: 16
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-lg)",
      marginTop: "var(--space-3xl)"
    }
  }, shown.map((e, i) => /*#__PURE__*/React.createElement(CategoryCard, _extends({
    key: i
  }, e, {
    href: "#"
  }))))), /*#__PURE__*/React.createElement(Band, {
    eyebrow: "Reading",
    title: "Recently published."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, ARTICLES.map(a => /*#__PURE__*/React.createElement(Card, {
    key: a.title,
    padding: "var(--space-2xl)",
    style: {
      display: "flex",
      alignItems: "center",
      gap: "var(--space-2xl)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-xs)"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm"
  }, a.cat), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-xs-size)",
      lineHeight: "var(--text-display-xs-line)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, a.title)), /*#__PURE__*/React.createElement(Badge, {
    tone: a.tone,
    soft: true
  }, a.read), /*#__PURE__*/React.createElement(Button, {
    variant: "text-arrow",
    style: {
      padding: 0
    }
  }, "Read"))))));
}
Object.assign(window, {
  Library,
  ENTRIES,
  ARTICLES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Library.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Pricing.jsx
try { (() => {
const {
  Band,
  Button,
  Card,
  Badge,
  Eyebrow
} = window.PeppyDesignSystem_1996eb;
const TIERS = [{
  name: "Starter",
  price: "$0",
  cadence: "forever",
  blurb: "Tokens and primitives for a single product.",
  features: ["All 156 tokens", "16 React primitives", "Community support"],
  cta: "Start free",
  featured: false
}, {
  name: "Team",
  price: "$96",
  cadence: "per month",
  blurb: "Templates, review tooling and shared theming.",
  features: ["Everything in Starter", "9 page templates", "Shared theme overrides", "Priority support"],
  cta: "Choose Team",
  featured: true
}, {
  name: "Enterprise",
  price: "Custom",
  cadence: "annual",
  blurb: "Governance for multi-product organisations.",
  features: ["Everything in Team", "Design review sessions", "SSO and audit log", "Named support engineer"],
  cta: "Talk to sales",
  featured: false
}];
function Tier({
  tier,
  onChoose
}) {
  const dark = tier.featured;
  return /*#__PURE__*/React.createElement(Card, {
    tone: dark ? "dark" : "canvas",
    elevation: dark ? 3 : 1,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    size: "sm",
    style: {
      color: dark ? "var(--mute-soft)" : "var(--text-muted)"
    }
  }, tier.name), dark ? /*#__PURE__*/React.createElement(Badge, null, "Most popular") : null), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "var(--space-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-display-lg-size)",
      lineHeight: "var(--text-display-lg-line)",
      fontWeight: 600,
      letterSpacing: "-0.5px"
    }
  }, tier.price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-sm-size)",
      color: dark ? "var(--mute-soft)" : "var(--text-muted)"
    }
  }, tier.cadence)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: dark ? "var(--mute-soft)" : "var(--text-body)"
    }
  }, tier.blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)",
      borderTop: `1px solid ${dark ? "#2a2a2c" : "var(--hairline)"}`,
      paddingTop: "var(--space-lg)"
    }
  }, tier.features.map(f => /*#__PURE__*/React.createElement("div", {
    key: f,
    style: {
      display: "flex",
      gap: "var(--space-md)",
      alignItems: "flex-start",
      fontSize: "var(--text-body-sm-size)",
      lineHeight: "var(--text-body-sm-line)",
      color: dark ? "#fff" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 16,
      height: 16,
      marginTop: 3,
      color: "var(--accent-green)"
    }
  }), f))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "auto",
      paddingTop: "var(--space-lg)"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: dark ? "secondary" : "primary",
    fullWidth: true,
    onClick: () => onChoose(tier)
  }, tier.cta)));
}
function Pricing({
  onChoose
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Band, {
    size: "sub",
    eyebrow: "Pricing",
    title: "Priced per team, not per seat.",
    lead: "Every plan ships the full token set. Paid plans add templates, theming and support.",
    style: {
      paddingBottom: "48px"
    }
  }), /*#__PURE__*/React.createElement(Band, {
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "var(--space-2xl)",
      alignItems: "stretch"
    }
  }, TIERS.map(t => /*#__PURE__*/React.createElement(Tier, {
    key: t.name,
    tier: t,
    onChoose: onChoose
  })))), /*#__PURE__*/React.createElement(Band, {
    eyebrow: "Included everywhere",
    title: "What every plan carries."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "var(--space-lg)"
    }
  }, [["palette", "Full token set"], ["component", "React primitives"], ["file-code", "TypeScript definitions"], ["accessibility", "WCAG AAA targets"]].map(([icon, label]) => /*#__PURE__*/React.createElement(Card, {
    key: label,
    padding: "var(--space-2xl)",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-md)"
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 20,
      height: 20,
      color: "var(--ink)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-body-md-size)",
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, label))))));
}
Object.assign(window, {
  Pricing,
  Tier,
  TIERS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Pricing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.DataTable = __ds_scope.DataTable;

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.Modal = __ds_scope.Modal;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.TextInput = __ds_scope.TextInput;

__ds_ns.Band = __ds_scope.Band;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.NavLink = __ds_scope.NavLink;

__ds_ns.SidebarNavRow = __ds_scope.SidebarNavRow;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CategoryCard = __ds_scope.CategoryCard;

})();
