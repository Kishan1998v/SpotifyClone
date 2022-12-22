import { fetchRequest } from "../api";
import { ENDPOINT } from "../common";

const onPlayListItemsClicked = (event) => {
  console.log(event.target);
};
export const loadFeaturedPlaylist = async () => {
  const {
    playlists: { items },
  } = await fetchRequest(ENDPOINT.featuredPlaylist);
  const playlistItemsSection = document.querySelector(
    "#featured-playlist-items"
  );

  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    playlistItem.className = "rounded p-4 bg-stone-700 hover:cursor-pointer";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", onPlayListItemsClicked);
    const [{ url }] = images;
    playlistItem.innerHTML = `
            <img src="${url}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
            <h2 class="text-xl">${name.slice(0, 22)}</h2>
            <h4 class="text-xs ">${description.slice(0, 62)}</h4>
       `;
    playlistItemsSection.appendChild(playlistItem);
  }
};
