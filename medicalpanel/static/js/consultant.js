function consultantRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/consultant/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrieveconsultant/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].name + "</td>";
                h += "<td><a href='" + data[i].image + "' target='_blank'>" + data[i].image + "</a></td>";
                h += "<td>" + data[i].description + "</td>";
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="updat(this)"></button>'+"</td>"
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="del(this)"></button>'+"</td>"
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }
        consultantRedirecting();


        $( document ).on('submit', '#adding', function (e) {
                   e.preventDefault();
                   var img = $('#img')[0].files[0];
                   if ($('#nm').val().length < 1){
                       $('#name').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#img').val().length < 1){
                       $('#image').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#des').val().length < 1){
                       $('#description').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   var reader = new FileReader();
                   reader.readAsBinaryString(img);
                    reader.onloadend = function () {
                        var base64 = btoa(reader.result);
                        console.log(base64);
                        var name = $('#nm').val();
                        var desc = $('#des').val();
                        console.log(name);
                        console.log(desc);
                        var data = {
                           name: name,
                           image: base64,
                           description: desc,
                       };
                        console.log(data);
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8000/panel/api/consultant/',
                            headers: {
                           'X-CSRFToken': "{{ csrf_token }}",
                            },
                            data: data,
                            success:function (res) {
                                if (res.status == 'ok'){
                                    consultantRedirecting();
                                    document.getElementById("adding").reset();
                                    $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                                    $('#name').html("");
                                    $('#image').html("");
                                    $('#description').html("");
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
                    };
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
                var name = msg.name;
                var image = msg.image;
                var description = msg.description;

                var x = document.createElement('input');
                x.value = name;
                x.id = 'names';
                x.name = 'name';
                x.className = 'form-control';
                x.type = 'text';


                var i = document.createElement('a');
                i.textContent = "Currently: http://localhost:8000/media/" + image;
                i.href = "http://localhost:8000/media/" + image;
                i.target = '_blank';
                i.id = 'current';

                var o = document.createElement('input');
                o.value = "image";
                o.id = 'im';
                o.name = 'image';
                o.className = 'form-control';
                o.type = 'file';
                o.required = false;

                var y = document.createElement('input');
                y.value = description;
                y.id = 'desp';
                y.name = 'description';
                y.className = 'form-control';
                y.type = 'text';


                var div = document.createElement('div');
                div.appendChild(x);
                div.appendChild(i);
                div.appendChild(o);
                div.appendChild(y);

                $("#form").html(div);
          });
        }

        // <!--after getting updating-->
        function USubmit(ref) {
            var u = $(ref).attr('data-url');
            var im = $('#im')[0].files[0];
            if ($('#im').val().length >1) {
                var reader = new FileReader();
                reader.readAsBinaryString(im);
                reader.onloadend = function () {
                    var base64 = btoa(reader.result);
                    console.log(base64);
                    var tito = $('#names').val();
                    var short = $('#desp').val();
                    var data = {
                        name: tito,
                        image: base64,
                        description: short,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            consultantRedirecting();
                        });
                }
            }else{
                var tito = $('#names').val();
                    var short = $('#desp').val();
                    var data = {
                        name: tito,
                        description: short,
                    };
                    console.log(data);
                    $.ajax({
                        type: "PUT",
                        url: u,
                        headers: {
                            "X-CSRFToken": "{{csrf_token}}"
                        },
                        data: data
                    })
                        .done(function (msg) {
                            console.log(msg);
                            consultantRedirecting();
                        });
            }
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
            consultantRedirecting();
            });
        }