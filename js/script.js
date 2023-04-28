const input = document.querySelector('input[name=url]');
const token = document.querySelector('input[name=token]');
const loading = document.querySelector('.loading');
const title = document.querySelector('.title');
const profile = document.querySelector('.user-profile');
const list = document.querySelector('.list');
const video = document.querySelector('.btn-video');
const audio = document.querySelector('.btn-audio');
const username = document.querySelector('.user-name');
const form = document.querySelector('form');

form.addEventListener('submit', function (event) {
  event.preventDefault();
  list.classList.add('d-none');
  if (input.value === '') {
    loading.textHTML = 'url not detected, please input url!';
  } else {
    $.ajax({
      method: 'POST',
      url: form.action,
      data: $(this).serialize(),
      beforeSend: function() {
        loading.innerHTML = 'Please wait...';
      },
      success: function(event) {
        input.value = '';
        if (event.type == 'error') {
          loading.innerHTML = event.message;
        } else if (event.type == 'token') {
          loading.innerHTML = event.message;
        } else {
          const user_name = event.data.author.nickname;
          const video_url = event.data.video[0];
          const audio_url = event.data.music.url;
          const avatar = event.data.author.avatar;
          const description = event.data.title;
          loading.innerHTML = '';
          username.innerHTML = `@${user_name}`;
          profile.setAttribute('src', avatar);
          video.addEventListener('click', () => {
            window.location.href = video_url;
          });
          audio.addEventListener('click', () => {
            window.location.href = audio_url;
          });
          title.innerHTML = description;
          list.classList.remove('d-none');
        }
      },
      fail: function() {
        alert('failed get data video');
      }
    })
  }
});