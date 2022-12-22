import { fetchRequest } from "../api";
import { ENDPOINT, logout } from "../common";
import { loadFeaturedPlaylist } from "./playlist";

const onProfileClick = (event) => {
  event.stopPropagation();
  const profileSelector = document.querySelector("#profile-menu");

  profileSelector.classList.toggle("hidden");
  if (!profileSelector.classList.contains("hidden")) {
    profileSelector.querySelector("#logout").addEventListener("click", logout);
  }
};
const showname = () => {
  const onhoverNav = document.querySelector("#user-profile-btn");
  onhoverNav.addEventListener("mouseover", () => {
    const val = document.querySelector("#display-name2");
    val.classList.remove("hidden");
  });
  onhoverNav.addEventListener("mouseout", () => {
    const val = document.querySelector("#display-name2");
    val.classList.add("hidden");
  });
};
const loadUserProfile = async () => {
  const defaultImage = document.querySelector("#default-image");
  const profileButton = document.querySelector("#user-profile-btn");
  const displayNameElement = document.querySelector("#display-name");
  const displayNameElement2 = document.querySelector("#display-name2");

  const { display_name, images } = await fetchRequest(ENDPOINT.userInfo);
  if (images?.lenght) {
    defaultImage.classList.add("hidden");
  } else {
    defaultImage.classList.remove("hidden");
  }
  profileButton.addEventListener("click", onProfileClick);
  displayNameElement.textContent = `${display_name.slice(0, 12)}...`;
  displayNameElement2.textContent = display_name;
};

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  showname();
  loadFeaturedPlaylist();

  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    const val = document.querySelector("#display-name2");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
      val.classList.add("hidden");
    }
  });
});
