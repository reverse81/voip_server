var html = '';
var emails = [];
var phones = [];
var statusarray = [];
$(function() {
    $('#loginButton').on("click", function () {
      $.ajax({
        type: 'POST',
        url: '/auth/login_admin',
        data : {email: $('#email').val(), pwd:$('#password').val()},
        dataType : 'JSON',
        success : function(data, statut){
          $.ajax({
            type: 'GET',
            url: '/users/all',
            headers: {"Authorization": "Bearer " + data.token},
            result : {email:data.email, phone:data.phone, status:data.status, ip:data.ip},
            dataType: 'JSON',
            success: function(result){
                  localStorage.setItem('token', data.token)

                  html += `<div class="limiter">`;
                  html += ` <span class="login100-form-title p-t-16 p-b-16">`;
                  html += `     VoIP User Management`;
                  html += `   </span>`;
                  html += `</div>`;

                  html += `<div class="limiter">`;
                  html += ` <div class="container-usrmgmt100">`;
                  html += `   <table width="300" class="usrmgt-table">`;
                  html += `     <tbody>`;

                  emails = [];
                  phones = [];
                  statusarray = [];
                  html += `
                  <tr>
                    <th>Phone Number</th>
                    <th>IP</th>
                    <th>User Status</th>
                    <th>User Delete</th>
                  </tr>`
                  for (var i = 0; i< result.length; i++) {
                  html += `       <tr id=${i}>`;

                  html += `         <td><label>${result[i].phone}</label></td>`;
                  html += `         <td><label>${result[i].ip}</label></td>`;
                  emails.push(result[i].ip);
                  phones.push(result[i].phone);
                  statusarray.push(result[i].status);
                  var checkV = "";
                  if (result[i].status == "enable")
                    checkV = "checked";
                  html += `         <td><label class="switch"><input id="status-cb" type="checkbox" ${checkV}><span class="slider round"></span></label></td>`;
                  html += `         <td><button id="del-btn" class="usrmgt-del-btn">X</button></td>`;
                  html += `       </tr>`;
                  }

                  html += `     </tbody>`;
                  html += `   </table>`;
                  html += ` </div>`;

                  html += `</div>`;

                  $("#contentArea").html(html);
                  return data;
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

    $(document).on("click","#status-cb", function(){
      var trId = $(this).closest("tr").attr('id');
      var newStatus;
      if (statusarray[trId] == "enable")
        newStatus = "disable";
      else
        newStatus = "enable";
      $.ajax({
        type: 'POST',
        url: '/users/updateStatus',
        headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
        data : {email: emails[trId], phone: phones[trId], status: newStatus},
        dataType : 'JSON',
        success : function(data, statut){
          // alert("update status: " + newStatus);
          return data;
        },
        error : function(resultat, statut, erreur){
          alert('update status error')
        },
      });
    });

    $(document).on("click","#del-btn", function(){
      var trId = $(this).closest("tr").attr('id');
      var theElement = $(this).closest("tr");
      $.ajax({
        type: 'POST',
        url: '/users/delete',
        headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
        data : {phone: phones[trId]},
        dataType : 'JSON',
        success : function(data, statut){
          // alert("delete phone number: " + phones[trId]);
          theElement.remove();
          return data;
        },
        error : function(resultat, statut, erreur){
          alert('delete error')
        },
      });
    });

    // for Test (create account)
    $(document).on("click","#create-btn", function(){
      $.ajax({
        type: 'POST',
        url: '/users/create',
        data : {email: $('#input-email').val(), pwd:$('#input-pwd').val()},
        dataType : 'JSON',
        success : function(data, statut){
          alert("create account: " + $('#input-email').val() + ", " + $('#input-pwd').val());
        },
        error : function(resultat, statut, erreur){
          alert('create account error')
        },
      });
    });

  });
