import { fetchRequest } from "../api";
import { ENDPOINT, getItemFromLocalStorage, LOADED_TRACKS, logout, SECTIONTYPE, setItemInLocalStorage } from "../common";


const onProfileClick = (event) => {
  event.stopPropagation();
  const profileSelector = document.querySelector("#profile-menu");
  profileSelector.classList.toggle("hidden");

  if (!profileSelector.classList.contains("hidden")) {
    profileSelector.querySelector("#logout").addEventListener("click", logout);
  }
};

const loadUserProfile = async () => {
  const coverContent = document.querySelector("#cover-content");
    coverContent.innerHTML = `
        <h1 class="text-6xl font-bold ">Hello <span id="title-Name"></span></h1>
    `;
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
//------------------------------------------------------------------------------------------------------------------------------------------------
//playlist tracks
//
           /**      <img id="player-img" class="h-[50px] w-[50px] bg-slate-400" src="" alt=" "/>
                <section class="flex pl-4 flex-col items-start justify-center text-sm truncate">
                    <h1 id = "player-track-title" class="font-semibold">Title</h1>
                    <p id ="player-track-description " class="text-xs text-neutral-500">description</p>
                </section>
                <p id="player-like-btn" class="item-center mt-1 py-[12px]"><span class="material-symbols-outlined" style="font-size: 20px">favorite</span></p>
            </section >
              
              */
//PLaying the specific track:
const audio = new Audio();

const updateIconsForPlayMode = (id) => {
  const playbutton = document.querySelector("#play");
  playbutton.querySelector("span").textContent = "pause_circle";
  const playButtononFromTrack = document.querySelector(`#play-track-${id}`);//we can access that track and now we can modify its content
  if (playButtononFromTrack) {
    playButtononFromTrack.textContent = "pause"
    
  }
  
}
const updateIconsForPauseMode = (id) => {
  const playbutton = document.querySelector("#play");
  playbutton.querySelector("span").textContent = "play_circle";
  const playButtononFromTrack = document.querySelector(`#play-track-${id}`);//we can access that track and now we can modify its content
  if (playButtononFromTrack) {
    playButtononFromTrack.textContent = "play_arrow";
  }
}

const onAudioMetaDataLoaded = (id) => {
  const totalsongDuration = document.querySelector("#totalSongDuration");
  totalsongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
  

}

const togglePlay = () => {
  if (audio.src) {
    if (audio.paused) {
      audio.play();
    }
    else {
      audio.pause();
    }
  }
  
}
//___________________________________________________________________________________________________________________________________________
  //previous and next functions
  const FindCurrentTrack = () => {
    const audioControl = document.querySelector("#player-audio-control");
    const trackId = audioControl.getAttribute("data-track-id");
    if (trackId) {
      const loadedTracks = getItemFromLocalStorage(LOADED_TRACKS);
      const currentTrackIndex = loadedTracks?.findIndex(trk => trk.id === trackId);
      return { currentTrackIndex, tracks:loadedTracks };
    }
    return null;
  }
const playNexttrack = () => {
  const { currentTrackIndex = -1, tracks = null } = FindCurrentTrack() ?? {};
  console.log(currentTrackIndex, tracks);
  if (currentTrackIndex > -1 && currentTrackIndex < tracks.length - 1) {
    playTrack(null, tracks[currentTrackIndex + 1]);
    console.log("clicked");
  }
  }
  const playPrevtrack = () => {
    const { currentTrackIndex = -1, tracks = null } = FindCurrentTrack() ?? {};
    if (currentTrackIndex > 0 && currentTrackIndex < tracks.length - 1) {
      playTrack(null, tracks[currentTrackIndex - 1]);
    }
  }
//___________________________________________________________________________________________________________________________________________

const playTrack = (event, { image, name: TrackTitle, artistNames, preview_url: previewURL, duration_ms: duration, id }) => {
  if (event?.stopPropagation) {
    event.stopPropagation(); // we are doing because we need to change the selected tag while different song is playing ..
  }
  if (audio.src === previewURL) {
    togglePlay();
  }
  else {
    
    document.querySelector("#player-img").src = image.url;
    document.querySelector("#player-track-title").textContent = TrackTitle;
    document.querySelector("#player-track-description").textContent = artistNames;
    const audioControl = document.querySelector("#player-audio-control")
    let liked = false;
    document.querySelector("#player-like-btn").addEventListener("click", () => {
      if (liked) {
        document.querySelector("#player-like-btn").classList.remove("material-symbols-outlined")
        document.querySelector("#player-like-btn").classList.add("material-symbols-rounded")

      }
      else {
        document.querySelector("#player-like-btn").classList.add("material-symbols-outlined")
        document.querySelector("#player-like-btn").classList.remove("material-symbols-rounded")
      
      }
      liked = !liked
    })
    //metadeta once the url is loaded this element is triggered and then
    audioControl.setAttribute("data-track-id", id);
    audio.src = previewURL;
    audio.play();
   
  }
}


const formatTime = (duration) => {
  const min = Math.floor(duration / 60_000);
  const sec = ((duration / 60_000) / 1000).toFixed(0);
  const formattedtime = sec == 60 ?
    min + 1 + ":00" : min + ":" + (sec < 10 ? "0" : "") + sec;
  return formattedtime;
}
//Function For selecting the tag
const onTrackSelection = (id, event) => {
  document.querySelectorAll("#trackss .track").forEach(trackItem => {
    
    if (trackItem.id === id) {
      console.log(trackItem)
       trackItem.classList.add("bg-neutral-700" , "selected")
    }
    else{
      trackItem.classList.remove("bg-neutral-700" , "selected")
    }
   })
}

const loadPlaylistTracks = ({ tracks }) => {
  console.log(tracks);
  const tracksSection = document.querySelector("#trackss");
  let trackNum = 1;
  const loadedTracks = [];
  for (let trackItem of tracks.items.filter(item => item.track.preview_url)) {
    let { id, artists, name, album, duration_ms, preview_url } = trackItem.track;
    let track = document.createElement("section");
    track.id = id;
    track.className = "track p-1 grid grid-cols-[20px_2fr_2fr_50px] item-center justify-items-start gap-4 text-secondary rounded-md hover:bg-neutral-800 transition-all"
    let image = album.images.find(img => img.height === 64);
    let artistNames = Array.from(artists, artist => artist.name).join(", ");
    track.innerHTML = `
      <p class="realtive w-full flex h-[20px] justify-center text-sm justify-self-center place-items-center mt-[11px]" id="tracknum"><span class="track-no">${trackNum++}</span></p>
      <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
          <img class="h-10 w-10 justify-center" src="${image.url}" alt="" srcset="">
          <article class="flex flex-col gap-1 ">
              <h2 class="song-ti text-base pt-[-20px] text-white line-clamp-1">${name}</h2>
              <p class="text-xs text-stone-400 line-clamp-1">${artistNames}</p>
          </article>
      </section>
      <p class="text-sm flex items-center justify-center">${album.name}</p>
      <p class="text-sm flex items-center justify-center">${formatTime(duration_ms)} </p>
    `
    track.addEventListener("click", (event) => onTrackSelection(id, event));
    const playbutton = document.createElement("button");
    playbutton.id = `play-track-${id}`;
    playbutton.className = `play absolute w-full l-0 text-sm t-1 drop-shadow-xl material-symbols-rounded invisible z-[10]`
    playbutton.textContent = "play_arrow";
    playbutton.addEventListener("click", (event) => playTrack(event, {image,name,artistNames,preview_url,duration_ms,id}));
    track.querySelector("p").appendChild(playbutton);
    tracksSection.appendChild(track);
    loadedTracks.push({ id, artistNames, name, album, duration_ms, preview_url, image });
  }
  setItemInLocalStorage(LOADED_TRACKS, loadedTracks);
}

//on playlist item clicked the Above content
const OnplaylistItemClickedContentbox = (url, name, description) => {
  const coverContent = document.querySelector("#cover-content");
  coverContent.innerHTML = `
      <article class = " flex items-end">
        <div class="rounded bg-neutral-800/20 h-[260px] w-[260px] drop-shadow-2xl ">
          <img src="${url}"  class=" flex rounded p-4 h-[260px] w-[260px] drop-shadow-xl"/>
        </div>
        <section class="ml-3 pb-5">
          <h1 class="text-6xl font-bold drop-shadow-xl">${name} </h1>
          <p class="ml-1 mt-3 drop-shadow-xl">${description}</p>
        </section>
      </article>
    `;

}

// ON CLICKING THE PLAYLIST item 
  const onPlayListItemsClicked = (event, id) => {
    console.log(event)
    const section = { type: SECTIONTYPE.PLAYLIST, playlist: id};
    history.pushState(section, "", `playlist/${id}`);
    loadSection(section);
  };
// MAKING THE PLAYLIST DASH
const fillContentForPlaylist =async (playlistId) => {
  const playlist = await fetchRequest(`${ENDPOINT.playlist}/${playlistId}`);
  const pageContent = document.querySelector("#page-content");
  pageContent.innerHTML = `
      <header id="stickyplaylist" class="py-4 mx-8 border-b-2 border-white/30">
        <nav>
            <ul class="text-xs grid grid-cols-[20px_2fr_2fr_50px] gap-4 text-gray-300">
                <li class="justify-self-center pl-2">#</li>
                <li class="ml-2">TITLE</li>
                <li>ALBUM</li>
                <li><img class="h-4 w-4" src="../time.png"/></li>
            </ul>
        </nav>
      </header>
      <section class="px-8 mt-4" id="trackss">
      </section>
  `
  loadPlaylistTracks(playlist);
  
}

const onContentScroll = (event) => {
  const { scrollTop } = event.target;
  const header = document.querySelector(".header");
  const coverElement = document.querySelector("#cover-content");
  const totalHeight = coverElement.offsetHeight;
  const coverOpacity = 100 - (scrollTop >= totalHeight ? 100 : ((scrollTop / totalHeight) * 100));
  const headerOpacity = (scrollTop >= header.offsetHeight ? 100 : ((scrollTop / header.offsetHeight) * 100));
  coverElement.style.opacity = `${coverOpacity}%`;
  header.style.background = `rgba(00 0 0 / ${headerOpacity}%)`;

  
  
  if (scrollTop >= 2) {
    if (scrollTop >= 159.5) {
      header.classList.add( "drop-shadow-md");
      
    }
    if (scrollTop <= 159.5) {
      header.classList.remove( "drop-shadow-md");
    }
  }

  if (history.state.type === SECTIONTYPE.PLAYLIST) {
    const coverele = document.querySelector("#cover-content");
    const playlistHeader = document.querySelector("#stickyplaylist");
    console.log(coverele.offsetHeight , header.offsetHeight , scrollTop)
    if (scrollTop >= 285) {
      playlistHeader.classList.add("sticky", "bg-neutral-900", "px-8" ,"drop-shadow-lg","border-white/10","z-100");
      playlistHeader.classList.remove("mx-8","border-white/30");
      playlistHeader.style.top = `${header.offsetHeight}px`;
    }
    else {
      playlistHeader.classList.remove("sticky", "bg-neutral-900", "px-8","drop-shadow-lg","border-white/10","z-100");
      playlistHeader.classList.add("mx-8","border-white/30");
      playlistHeader.style.top = `revert`;
    }
  }
}

//------------------------------------------------------------------------------------------------------------------------------------------------
const loadSection = (section) => {
  if (section.type === SECTIONTYPE.DASHBOARD) {
     fillContentForDashboard();
     loadPlaylists();
  } else if (section.type === SECTIONTYPE.PLAYLIST){
    //load the elements for playlist
    fillContentForPlaylist(section.playlist)
  }
  document.querySelector(".content").addEventListener("scroll",onContentScroll );


};
//--------------------------------------------------------------------------------------------------------------------------
// Loading PLAYLIST>JS

const loadPlaylist = async (endpoint, elementId) => {
  let { playlists: { items } } = await fetchRequest(endpoint);
  const playlistItemsSection = document.querySelector(`#${elementId}`);

  for (let { name, description, images, id } of items) {
    const playlistItem = document.createElement("section");
    const [{ url }] = images;
    playlistItem.className ="rounded p-4 bg-neutral-800/80 hover:cursor-pointer hover:bg-neutral-700/90 transition-all duration-500";
    playlistItem.id = id;
    playlistItem.setAttribute("data-type", "playlist");
    playlistItem.addEventListener("click", async (event) => { await onPlayListItemsClicked(event, id); await OnplaylistItemClickedContentbox(url, name, description)});
    console.log(items);
    playlistItem.innerHTML = `
            <img src="${url}" alt="${name}" class="rounded mb-2 object-contain shadow"/>
            <h2 class=" text-xl font-semibold truncate">${name}</h2>
            <h4 class="text-xs text-neutral-400 line-clamp-2">${description}</h4>
       `;
    playlistItemsSection.appendChild(playlistItem);
  }
};

const fillContentForDashboard = () => {
  const pageContent = document.querySelector("#page-content");
  const coverContent = document.querySelector("#cover-content");
    coverContent.innerHTML = `
        <h1 class="text-6xl font-bold ">Hello <span id="title-Name"></span></h1>
    `;
  const playlistMap = new Map([
    ["featured", "featured-playlist-items"],
    ["top playlists", "top-playlist-items"],
  ]);
  let innerHTMLs = "";
  for (let [type, id] of playlistMap) {
    console.log(type, id);
    innerHTMLs += `
            <article class="p-4 ">
                <h1 class="text-2xl mb-4 capitalize pb-4 border-b-2 border-stone-700/80"><b>${type}</b> </h1>
                <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4 overflow-auto">
                </section>
            </article>
        `;
  }

  pageContent.innerHTML = innerHTMLs;
};




//------------------------------------------------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const volume = document.querySelector("#volume");
  const playbutton = document.querySelector("#play");
  let progressInterval;
  const songDurationCompleted = document.querySelector("#songDurationCompleted");
  const songprogress = document.querySelector("#progress");
  const timeline = document.querySelector("#timeline");
  const audioControl = document.querySelector("#player-audio-control")
  const coverContent = document.querySelector("#cover-content");

  //next and prev
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");


  //
    coverContent.innerHTML = `
        <h1 class="text-6xl font-bold ">Hello <span id="title-Name"></span></h1>
    `;
    loadUserProfile();
    const section = { type: SECTIONTYPE.DASHBOARD };
    history.pushState(section,"", "");
    loadSection(section);
    
  // showname();
//------------------------------------------------------------------------------------------------------------------------

    document.addEventListener("click", () => {
      const profileMenu = document.querySelector("#profile-menu");
      if (!profileMenu.classList.contains("hidden")) {
        profileMenu.classList.add("hidden");
      }
    });
  
  
//------------------------------------------------------------------------------------------------------------------------
  audio.addEventListener("play", () => {
    const selectedTrackedId = audioControl.getAttribute("data-track-id");
    const tracks = document.querySelector("#trackss");
    const playingTrack = tracks?.querySelector("section.playing");
    const selectedTrack = tracks?.querySelector(`[id="${selectedTrackedId}"]`);
    //everytime we need to clear the int clearInterval(progressInterval);
    if (playingTrack?.id !== selectedTrack?.id) {
      playingTrack?.classList.remove("playing");
    }
    selectedTrack?.classList.add("playing");
    progressInterval = setInterval(() => {
      if (audio.paused) {
        return
      }
      songDurationCompleted.textContent = `0:${audio.currentTime.toFixed(0) < 10 ? ("0" + audio.currentTime.toFixed(0)) : (audio.currentTime.toFixed(0))}`;
      songprogress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
    }, 100)
    updateIconsForPlayMode(selectedTrackedId);
  

  });
  audio.addEventListener("pause", () => {
    
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    const selectedTrackedId = audioControl.getAttribute("data-track-id");
    updateIconsForPauseMode(selectedTrackedId);
  })
//------------------------------------------------------------------------------------------------------------------------
  
    audio.addEventListener("loadedmetadata", onAudioMetaDataLoaded)
    playbutton.addEventListener("click", () => togglePlay());
//------------------------------------------------------------------------------------------------------------------------
    volume.addEventListener("change", () => {
      audio.volume = volume.value / 100;
      })
    timeline.addEventListener("click", (e) => {
      const timelineWidth = window.getComputedStyle(timeline).width;
      const timetoseek = (e.offsetX / parseInt(timelineWidth)) * audio.duration;
      audio.currentTime = timetoseek;
      songprogress.style.width = `${(audio.currentTime /audio.duration)*100}%`
      })
//-----------------------------------------------------------------------------------------------------------------------------
  //prev and next funxtionality
    next.addEventListener("click",playNexttrack)
    prev.addEventListener("click",playPrevtrack)
//------------------------------------------------------------------------------------------------------------------------
    window.addEventListener("popstate", (event) => {
      //we want the state then load the section
      loadSection(event.state);
    })

});

