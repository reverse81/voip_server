$(function() {
    $('#loginButton').on("click", function () {
      $.ajax({
        type: 'POST',
        url: '/admin/login',
        data : {email: $('#email').val(), pass:$('#password').val()},
        dataType : 'JSON',
        success : function(data, statut){
            $.ajax({
				type: 'GET',
				url: '/admin/users',
				headers: {"Authorization": "Bearer " + data.token},
				success: function(data){
                    //  localStorage.setItem('token', data.token)
                    
                    var html = 
                            ' <div class="container-login100">';
                    html += ' <div class="wrap-login100">';
                    html += '   <span class="login100-form-title p-b-26">';
						        html += '     VoIP User Management';
                    html += '   </span>';
                    
                      //  for (var i = 0; i< users.length; i++) {
                      
                      //     html += `<li><a href="/">${users[i].email}: ${users[i].phone} </a></li>`;
                      //  }
                    html += ' </div>';
                    html += '</div>';
                    
                    $("#contentArea").html(html);                     
                },
                error : function(resultat, statut, erreur){
                    alert('User management error')
                },
			});
        },
        error : function(resultat, statut, erreur){
            alert('Admin Login error')
        },
      });
    });
  });
  