const toaster = (msg, duration, className) => {
  var el = document.createElement("div");
  el.setAttribute(
    "style",
    "position:absolute;top:20%;margin:auto;left:50%;transform:translateX(-50%)"
  );
  el.className = "text-white p-2 border border-dark";
  el.classList.add(className);
  el.innerHTML = msg;
  setTimeout(function() {
    el.parentNode.removeChild(el);
  }, duration);
  document.body.appendChild(el);
};

export default toaster;
