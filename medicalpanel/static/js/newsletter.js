function newletterRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/newsletter/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrievenewsletter/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].email + "</td>";
                h += "<td>" + data[i].dated + "</td>";
                // {#h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="update(this)"></button>'+"</td>"#}
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="del(this)"></button>'+"</td>";
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }
        newletterRedirecting();

         $( document ).on('submit', '#newsForm', function (e) {
                   e.preventDefault();
                    var spinner = $('#spinner-subscribe');
                   spinner.removeClass('fa-arrow-right');
                   spinner.addClass('fa-spinner');
                   spinner.addClass('fa-spin');
                   $.ajax({
                       type: 'POST',
                       url: 'http://localhost:8000/panel/api/newsletter/',
                       data:{
                           email :$('#em').val(),
                           csrfmiddlewaretoken:$('input[name=csrfmiddlewaretoken]').val()
                       },
                       success:function (res) {
                           spinner.removeClass('fa-spinner');
                           spinner.removeClass('fa-spin');
                           spinner.addClass('fa-arrow-right');
                           if (res.status == 'ok'){
                               newletterRedirecting();
                               $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                               document.getElementById("newsForm").reset();
                               $('#error-message').html("");
                           } else if (res.status=="error") {
                               var keys = Object.keys(res.message);
                               var html = "";
                               for (var i = 0; i < keys.length; i++) {
                                   var message = res.message[keys[i]];
                                   var s = "<i class='errorlist'>"+message+"</i>";
                                   html += s;
                               }
                               $('#error-message').html(html);
                           }
                       }
                   });
                });

        // <!--Delete getting-->
        function del(ref) {
           var u = $(ref).attr('data-url');
           $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function DSubmit(ref){
            var u = $(ref).attr('data-url');
            $.ajax({
                 type:"DELETE",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 }
            })
            .done(function( msg ) {
            console.log(msg);
            newletterRedirecting();
            });
        }