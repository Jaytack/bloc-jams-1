var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    +   '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '  <td class="song-item-title">' + songName + '</td>'
    +   '  <td class="song-item-duraiton">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            $(this).html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
    };
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
        console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    $albumSongList.empty();
    
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var nextSong = function() {
    
    var lastSongPlayed = currentSongFromAlbum; // store current song before moving to next song
    var lastSongNumber = currentlyPlayingSongNumber; // store current song number before moving to next song
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum) + 1; // get index of song and increment
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0; 
    } // set currentSongIndex to 0 if currentSongIndex is greater than or equal to number of songs
    
    currentlyPlayingSongNumber = currentSongIndex + 1; // update currently playing song number to use later
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex]; // set current song to the next song
    
    updatePlayerBarSong(); // update player bar

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate); // for next song, replace number with pause icon
    $lastSongNumberCell.html(lastSongNumber); // for last song played, replace icon with number
    
};

var previousSong = function() {
    
    var lastSongPlayed = currentSongFromAlbum; // store current song before moving to previous song
    var lastSongNumber = currentlyPlayingSongNumber; // store current song number before moving to previous song
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum) - 1; // get index of song and decrement
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    } // set currentSongIndex to largest index number of songs array
    
    currentlyPlayingSongNumber = currentSongIndex + 1; // update currently playing song number to use later
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex]; //set current song to the previous song
    
    updatePlayerBarSong(); // update player bar
    
    var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $previousSongNumberCell.html(pauseButtonTemplate); // for previous song, replace number with pause icon
    $lastSongNumberCell.html(lastSongNumber); // for the last song played, replace icon with number
    
};

var updatePlayerBarSong = function(){

$('.currently-playing .song-name').text(currentSongFromAlbum.title);
$('.currently-playing .artist-name').text(currentAlbum.artist);
$('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
