$(function() {
  emails = [];
  phones = [];
  statusarray = [];

  function makeuserhtml(result){
    var html='';
    html += `
    <div class="table100">
      <div id="table-scroll">
      <table>
        <thead>
      <tr class="table100-head">
        <th class="column1">Phone Number</th>
        <th class="column2">IP</th>
        <th class="column2">Permissions</th>
        <th class="column2">User Status</th>
        <th class="column2">User Delete</th>
          </tr>
      </thead>`
    html +=   `<div style=height:150px; overflow:auto;">`
    for (var i = 0; i < result.length; i++) {
      html+=`
        <tr id=${i}>
        <td class="column1">${result[i].phone}</td>
        <td class="column2">${result[i].ip}</td>
        <td class="column2">${result[i].permission}</td>
      `
      emails.push(result[i].ip);
      phones.push(result[i].phone);
      statusarray.push(result[i].status);
      var checkV = "";
      if (result[i].status == "enable")
        checkV = "checked";
      html += `         <td><label class="switch"><input id="status-cb" type="checkbox" ${checkV}><span class="slider round"></span></label></td>`;
      html += `         <td><button id="del-btn" class="usrmgt-del-btn">delete</button></td>`;
      html += `       </tr>`;
    }

    html += `     </tbody>`;
    html += `   </table>`;
    html += ` </div>`;

    html += `</div>`;

    return html;
  }

  $(document).ready(function() {
    $.ajax({
      type: 'GET',
      url: '/users/all',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      success: function(result) {
        html = makeuserhtml(result)
        $("#contentArea").html(html);
        return html
      },
      error: function(jqXHR,textStatus,errorThrown) {
          if (jqXHR.status === 401 || jqXHR.status === 404) {
            window.location = "/";
          } else {
              console.log("Unexpected error loading settings:",jqXHR.status,textStatus);
          }
      }
    });
  });

  $(document).on("click","#user-btn", function(){
    $.ajax({
      type: 'GET',
      url: '/users/all',
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      success: function(result) {
        var html=makeuserhtml(result);

        $("#contentArea").html(html);
        return html;
      },
      error: function(jqXHR,textStatus,errorThrown) {
          if (jqXHR.status === 401 || jqXHR.status === 404) {
            window.location = "/";
          } else {
              console.log("Unexpected error loading settings:",jqXHR.status,textStatus);
          }
      }
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
        alert("delete request completed.");
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

  $(document).on("click","#logout-btn", function(){
    localStorage.removeItem('token');
    location.reload();
  });

  $(document).on("click","#schedules-btn", function(){
    $.ajax({
      type: 'GET',
      url: '/schedule/all',
      headers: {"Authorization": "Bearer " + localStorage.getItem('token')},
      dataType : 'JSON',
      success : function(result, statut){
        var html='';
        html += `
        <div class="table100">
          <div id="table-scroll">
          <table>
            <thead>
          <tr class="table100-head">
            <th class="column1">Conference Call Number</th>
            <th class="column2">Schedules</th>
            <th class="column2">Participants</th>
            <th class="column2">expireAt</th>
          </tr>
          </thead>`
        html +=   `<div style=height:150px; overflow:auto;">`
        for (var i = 0; i < result.length; i++) {
          var from  = new Date(result[i].schedule.from);
          var to = new Date(result[i].schedule.to)
          html+=`
            <tr id=${i}>
            <td class="column1">${result[i].phoneNumber}</td>
            <td class="column2">${from.toLocaleString('en-GB', {timeZone: 'UTC'})} ~<br> ${to.toLocaleString('en-GB', {timeZone: 'UTC'})}</td>
            <td class="column2">${result[i].participants}</td>
            <td class="column2">${result[i].expireAt}</td>
          `
          html += `       </tr>`;
        }

        html += `     </tbody>`;
        html += `   </table>`;
        html += ` </div>`;
        html += ` </div>`;
        html += `</div>`;

        $("#contentArea").html(html);
        return html;
        return res;
      },
      error : function(resultat, statut, erreur){
        alert('update status error')
      },
    });
  });
});
