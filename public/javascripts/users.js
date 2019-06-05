$(function() {
  $("button").on("click", function () {
    $.ajax({
      type: 'GET',
      url: '/users/all',
      success: function(users) {
        console.log(users);
        var html = '';
        for (var i = 0; i< users.length; i++) {
        
            html += `<li><a href="/">${users[i].email}: ${users[i].phone} </a></li>`;
        }
        $('#target').html(html);
      }
    });
  });
});
