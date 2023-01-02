import { fetchRequest } from "../api";
import { onPlayListItemsClicked } from "./dashboard";
export const loadPlaylist = async (endpoint, elementId) => {
  const {
    playlists: { items }
  } = await fetchRequest(endpoint);
  const playlistItemsSection = document.querySelector(`#${elementId}`);

  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className =
      "rounded p-4 bg-neutral-800/80 hover:cursor-pointer hover:bg-neutral-700";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", onPlayListItemsClicked);
    const [{ url }] = images;
    playlistItem.innerHTML = `
            <img src="${url}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
            <h2 class="text-xl font-semibold truncate">${name}</h2>
            <h4 class="text-xs text-secondary line-clamp-2">${description}</h4>
       `;
    playlistItemsSection.appendChild(playlistItem);
  }
};

export const fillContentForDashboard = () => {
  const pageContent = document.querySelector("#page-content");
  const playlistMap = new Map([
    ["featured", "featured-playlist-items"],
    ["top playlists", "top-playlist-items"],
  ]);
  let innerHTMLs = "";
  for (let [type, id] of playlistMap) {
    console.log(type, id);
    innerHTMLs += `
            <article class="p-4 ">
                <h1 class="text-3xl mb-4 capitalize pb-4 border-b-2 border-violet-500"><b>${type}</b> </h1>
                <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4 overflow-auto" >
                </section>
            </article>
        `;
  }
  pageContent.innerHTML = innerHTMLs;
};
