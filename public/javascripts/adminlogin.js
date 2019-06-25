var html = '';
var emails = [];
var phones = [];
var statusarray = [];
$(function() {
  function login(){
    $('#loginButton').on("click", function () {
      $.ajax({
        type: 'POST',
        url: '/auth/login_admin',
        data : {email: $('#email').val(), pwd:$('#password').val()},
        dataType : 'JSON',
        success : function(data, statut){
          localStorage.setItem('token', data.token)
          console.log("err?");
           window.location = "http://localhost:3000/users/";
        },
        error : function(resultat, statut, erreur){
            alert('Admin Login error')
        },
      });
    });
  }
  $(function() {
    login()
  });

  });
