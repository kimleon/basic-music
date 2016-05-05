$(function() {
  var mp3_player = document.getElementById('mp3-player');
  var YT_player = document.getElementById("youtube-video");
  var url_source = document.getElementById('url-input');
  var all_list = document.getElementById("all-songs-list");
  var name_input = document.getElementById("name-input");
  var songs_checkform = document.getElementById("songs-checkform");
  var new_playlist_button = document.getElementById("new-playlist");
  var create_playlist_buttons = document.getElementById("choosing-songs");
  var songs_nocheck = document.getElementById("all-songs-nocheck");
  var songs_withcheck = document.getElementById("all-songs-withcheck");
  var playlists_list = document.getElementById("playlists-list");
  var current_mp3;
  var url_songs = {};
  var all_songs = [];


  $('#url-submit').click(function() {
    var url = url_source.value;
    if (url.substr(url.length - 4) == ".mp3") {
      update_song_url(url);
      var testRE = url.match("[assets|Music]/(.*).mp3");
      song_title = decodeURI(testRE[1])
      console.log(song_title)
      add_new_song(song_title, url, "mp3");
      $('#url-input').val('');
    } else if (url.substr(32) !== "https://www.youtube.com/watch?v=" || url.substr(31) !== "http://www.youtube.com/watch?v=") {
      var split_url = url.split('watch?v=');
      var embed_url = split_url[0]+'embed/'+split_url[1];
      console.log(embed_url)
      var yt_title;
      // var q = 'https://www.googleapis.com/youtube/v3/videos?id='+split_url[1]+'&key=AIzaSyAq29wjl5DIIRoBwnDePV6SJXtgcGM-VhQ&fields=items(snippet(title))&part=snippet';
      $.getJSON( "https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id="+split_url[1]+"&key=AIzaSyAq29wjl5DIIRoBwnDePV6SJXtgcGM-VhQ", function( data ) {
       //var obj = $.parseJSON(data);
        yt_title = data.items[0].snippet.localized.title;
        console.log(url)
        console.log(yt_title);
      });
      add_new_song(yt_title, embed_url, "youtube");
      play_yt_video(embed_url);
      $('#url-input').val(''); 
    } else {
      console.log("not mp3 or youtube url")
    }
  });

  $('#all-songs-list').click(function(e) {
    if(e.target && e.target.nodeName == "LI") {
      mp3_player.src = e.target.getAttribute('url');
      console.log(e.target.getAttribute('url') + " was clicked");
    }
  });

  $('#playlists-list').click(function(e) {
    if(e.target && e.target.nodeName == "LI") {
      mp3_player.src = e.target.getAttribute('url');
      console.log(e.target.getAttribute('url') + " was clicked");
    }
  });

  $('#new-playlist').click(function() {
    new_playlist_button.style.display = "none";
    create_playlist_buttons.style.display = "block";
    songs_nocheck.style.display = "none";
    songs_withcheck.style.display = "block";
  });

  $('#create-playlist').click(function() {
    new_playlist_button.style.display = "block";
    create_playlist_buttons.style.display = "none";
    songs_nocheck.style.display = "block";
    songs_withcheck.style.display = "none";
    var playlist_title = name_input.value;
    var playlist_songs = [];
    $("input:checkbox:checked").each(function () {
        playlist_songs.push($(this).val());
    });

    var title = document.createElement("H4");             
    var t = document.createTextNode(playlist_title);    
    title.appendChild(t); 

    var playlist_ordered = document.createElement('ol');
    for(var i = 0; i < playlist_songs.length; i++) {
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(playlist_songs[i]));
      var mp3_url = document.createAttribute("url");       
      mp3_url.value = url_songs[playlist_songs[i]];  
      item.setAttributeNode(mp3_url); 
      playlist_ordered.appendChild(item);
    }

    playlists_list.appendChild(title);
    playlists_list.appendChild(playlist_ordered);  

    clear_fields(); 
  });

  $('#cancel-playlist').click(function() {
    new_playlist_button.style.display = "block";
    create_playlist_buttons.style.display = "none";
    songs_nocheck.style.display = "block";
    songs_withcheck.style.display = "none";
    clear_fields();
  });

  clear_fields = function() {
    name_input.value = "";
    $("input:checkbox").each(function () {
      $(this).context.checked = false;
    });
  }

  update_song_url = function(url) {
    YT_player.style.display = "none";
    mp3_player.style.display = "block";
    current_mp3 = url;
    all_songs.push(current_mp3);
    var src = document.createElement("SOURCE");
    src.setAttribute("src", url);
    src.setAttribute("type", "audio/mp3");
    mp3_player.appendChild(src);
  }

  update_song_file = function(file) {
    current_mp3 = file;
    all_songs.push(current_mp3);
    mp3_player.src = file.name;
    if ('name' in file) {
      console.log("name: " + file.name);
    }
    if ('size' in file) {
      console.log("size: " + file.size);
    }
  }

  add_new_song = function(song_name, song_url, type) {
    url_songs[song_name] = song_url;
    var new_song = document.createElement('li');
    new_song.appendChild(document.createTextNode(song_name));
    var mp3_url = document.createAttribute("url");       
    mp3_url.value = song_url;  
    new_song.setAttributeNode(mp3_url); 
    var url_type = document.createAttribute("url_type");       
    url_type.value = type;  
    new_song.setAttributeNode(url_type); 
    all_list.appendChild(new_song);

    var song_input = document.createElement("INPUT");
    song_input.setAttribute("type", "checkbox");
    song_input.setAttribute("value", song_name);
    var song_label = document.createTextNode(song_name);
    var br = document.createElement('br');
    songs_checkform.appendChild(song_input);
    songs_checkform.appendChild(song_label);
    songs_checkform.appendChild(br);
  }

});

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtube-video', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  console.log("player ready");
  //do whatever you want here. Like, player.playVideo();

}
function onPlayerStateChange() {
  console.log("player state changed");
}

play_yt_video = function(url) {
  var YTplayer = document.getElementById("youtube-video");
  var mp3player = document.getElementById('mp3-player');
  YTplayer.style.display = "block";
  mp3player.style.display = "none";
  console.log("visible yt player")
  YTplayer.src=url;
  console.log("should have set url: "+url)
}

