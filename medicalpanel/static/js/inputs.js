function inputRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/input/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrieveinput/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].clients_served + "</td>";
                h += "<td>"  + data[i].x_rays_done + "</td>";
                h += "<td>" + data[i].worldwide_stuff + "</td>";
                h += "<td>" + data[i].lives_saved  + "</td>";
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="updat(this)"></button>'+"</td>"
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="del(this)"></button>'+"</td>";
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }
        inputRedirecting();

        $( document ).on('submit', '#adding', function (e) {
                   e.preventDefault();
                   if ($('#clients').val().length < 1){
                       $('#clients_served').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#xrays').val().length < 1){
                       $('#x_rays_done').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#stuff').val().length < 1){
                       $('#worldwide_stuff').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#lives').val().length < 1){
                       $('#lives_saved').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8000/panel/api/input/',
                            headers: {
                           'X-CSRFToken': "{{ csrf_token }}",
                            },
                            data: {
                                clients_served :$('#clients').val(),
                                x_rays_done : $('#xrays').val(),
                                worldwide_stuff: $('#stuff').val(),
                                lives_saved : $('#lives').val()
                            },
                            success:function (res) {
                                if (res.status == 'ok'){
                                    inputRedirecting();
                                    document.getElementById("adding").reset();
                                    $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                                    $('#clients_served').html("");
                                    $('#x_rays_done').html("");
                                    $('#worldwide_stuff').html("");
                                    $('#lives_saved').html("");
                                }else if (res.status=="error") {
                                    var keys = Object.keys(res.message);
                                    console.log(keys);
                                    for (var i = 0; i < keys.length; i++) {
                                        var msg = res.message[keys[i]];
                                        var key = keys[i];
                                        $('#'+key).html("<span class='errorlist'>"+msg+"</span>");
                                    }
                                }
                            }
                        });
        });

        // <!--Update getting-->
        function updat(ref) {
            var u = $(ref).attr('data-url');
            $('#update-user').attr('data-url', u);
           $.ajax({
                 type:"GET",
                 url: u,
            })
            .done(function( msg ) {
                var cli = msg.clients_served;
                var xray = msg.x_rays_done;
                var world = msg.worldwide_stuff;
                var saved = msg.lives_saved;

                var x = document.createElement('input');
                x.value = cli;
                x.id = 'tito';
                x.name = 'title';
                x.className = 'form-control';
                x.type = 'text';

                var i = document.createElement('input');
                i.value = xray;
                i.id = 'im';
                i.name = 'image';
                i.className = 'form-control';
                i.type = 'text';


                var y = document.createElement('input');
                y.value = world;
                y.id = 'dest';
                y.name = 'description';
                y.className = 'form-control';
                y.type = 'text';

                var z = document.createElement('input');
                z.value = saved;
                z.id = 'au';
                z.name = 'author';
                z.className = 'form-control';
                z.type = 'text';

                var div = document.createElement('div');
                div.appendChild(x);
                div.appendChild(i);
                div.appendChild(y);
                div.appendChild(z);

                $("#form").html(div);
          });
        }

        // <!--after getting updating-->
        function USubmit(ref) {
           var u = $(ref).attr('data-url');
           $.ajax({
                 type:"PUT",
                 url: u,
                 headers: {
                        "X-CSRFToken": "{{csrf_token}}"
                 },
                 data: {
                        'clients_served': $('#tito').val(),
                        'x_rays_done': $('#im').val(),
                        'worldwide_stuff': $('#dest').val(),
                        'lives_saved': $('#au').val()
                        }
            })
            .done(function( msg ) {
             console.log(msg);
             inputRedirecting();
          });
        }

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
            inputRedirecting();
            });
        }