import "./style.css";

//Creating a login Check Authentication eventlistner

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("accessToken")) {
    window.location.href = "dashboard/dashboard.html";
  } else {
    window.location.href = "login/login.html";
  }
});
