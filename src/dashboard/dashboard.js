import { fetchRequest } from "../api";
import { ENDPOINT, logout, SECTIONTYPE } from "../common";
import { fillContentForDashboard, loadPlaylist } from "./playlist";

const onProfileClick = (event) => {
  event.stopPropagation();
  const profileSelector = document.querySelector("#profile-menu");
  profileSelector.classList.toggle("hidden");

  if (!profileSelector.classList.contains("hidden")) {
    profileSelector.querySelector("#logout").addEventListener("click", logout);
  }
};

const loadUserProfile = async () => {
  const defaultImage = document.querySelector("#default-image");
  const profileButton = document.querySelector("#user-profile-btn");
  const displayNameElement = document.querySelector("#display-name");
  const displayNameElement2 = document.querySelector("#display-name2");
  const displayTitle_Name = document.querySelector("#title-Name");

  const { display_name, images } = await fetchRequest(ENDPOINT.userInfo);
  if (images?.lenght) {
    defaultImage.classList.add("hidden");
  } else {
    defaultImage.classList.remove("hidden");
  }
  profileButton.addEventListener("click", onProfileClick);
  displayNameElement.textContent = `${display_name
    .split(" ")[0]
    .toLowerCase()} `;
  displayNameElement2.textContent = display_name;
  displayTitle_Name.textContent = display_name.split(" ")[0];
};

const loadPlaylists = () => {
  loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items");
  loadPlaylist(ENDPOINT.toplists, "top-playlist-items");
};

export const onPlayListItemsClicked = (event) => {
  console.log(event.target);
  const section = { type: SECTIONTYPE.PLAYLIST };
  history.pushState(section, "", "playlist");
  loadSection(section);
};

const loadSection = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
    fillContentForDashboard();
    loadPlaylist();
  } else {
    //load the elements for playlist
    const pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = "Playlist to be loaded here";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  loadUserProfile();
  const section = { type: SECTIONTYPE.DASHBOARD };
  history.pushState(section, "", "");
  loadSection(section);
  fillContentForDashboard();
  loadPlaylists();
  // showname();
  document.addEventListener("click", () => {
    const profileMenu = document.querySelector("#profile-menu");
    if (!profileMenu.classList.contains("hidden")) {
      profileMenu.classList.add("hidden");
    }
  });

  document.querySelector(".content").addEventListener("scroll", (event) => {
    const { scrollTop } = event.target;
    const header = document.querySelector(".header");
    if (scrollTop >= header.offsetHeight) {
      header.classList.add(
        "sticky",
        "top-0",
        "bg-indigo-600/50",
        "drop-shadow-4xl"
      );
      header.classList.remove("bg-transparent");
    } else {
      header.classList.remove(
        "sticky",
        "top-0",
        "bg-indigo-600/50",
        "drop-shadow-4xl"
      );
      header.classList.add("bg-transparent");
    }
  });
});

//------------------------------------------------------------------------------------------------------------------------
