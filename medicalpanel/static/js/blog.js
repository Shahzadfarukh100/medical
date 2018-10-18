function blogRedirecting(){
        $.ajax({
          method: "GET",
          url: "http://localhost:8000/panel/api/blog/",
        })
          .done(function( msg ) {
            var data = JSON.parse(msg);
            var html = "";
            for (var i=0; i < data.length; i++) {
                var h = "<tr>";
                var url = "http://localhost:8000/panel/api/retrieveblog/0";
                url = url.slice(0, url.length-1) + data[i].id;
                url = "data-url="+url;
                h += "<td>" + data[i].id + "</td>";
                h += "<td>" + data[i].blog_title + "</td>";
                h += "<td><a href='" + data[i].image + "' target='_blank'>" + data[i].image + "</a></td>";
                h += "<td>" + data[i].blog_description + "</td>";
                h += "<td>" + data[i].author  + "</td>";
                h += "<td>" + data[i].created_date  + "</td>";
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-edit"'+url+' data-toggle="modal" data-target="#Update" onclick="updat(this)"></button>'+"</td>"
                h += "<td>"+'<button class="btn btn-primary btn-sm fa fa-trash"'+url+' data-toggle="modal" data-target="#Delete" onclick="del(this)"></button>'+"</td>";
                h += "</tr>";
                html += h;
            }
            $("#blog").html(html);
          });
          }
        blogRedirecting();

        $( document ).on('submit', '#adding', function (e) {
                   e.preventDefault();
                   var img = $('#img')[0].files[0];
                   if ($('#tit').val().length < 1){
                       $('#blog_title').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#img').val().length < 1){
                       $('#image').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#des').val().length < 1){
                       $('#blog_description').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   if ($('#thor').val().length < 1){
                       $('#author').html("<span class='errorlist'>This field may not be blank.</span>");
                   }
                   var reader = new FileReader();
                   reader.readAsBinaryString(img);
                    reader.onloadend = function () {
                        var base64 = btoa(reader.result);
                        console.log(base64);
                        var title = $('#tit').val();
                        var desc = $('#des').val();
                        var thor = $('#thor').val();
                        console.log(title);
                        console.log(desc);
                        console.log(thor);
                        var data = {
                           blog_title: title,
                           image: base64,
                           blog_description: desc,
                           author: thor,
                       };
                        console.log(data);
                        $.ajax({
                            type: 'POST',
                            url: 'http://localhost:8000/panel/api/blog/',
                            headers: {
                           'X-CSRFToken': "{{ csrf_token }}",
                            },
                            data: data,
                            success:function (res) {
                                if (res.status == 'ok'){
                                    blogRedirecting();
                                    document.getElementById("adding").reset();
                                    $('#completed').html("<span class='successMsg'>"+res.message+"</span>");
                                    $('#blog_title').html("");
                                    $('#image').html("");
                                    $('#blog_description').html("");
                                    $('#author').html("");
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
                var title = msg.blog_title;
                var image = msg.image;
                var description = msg.blog_description;
                var author = msg.author;

                var x = document.createElement('input');
                x.value = title;
                x.id = 'tito';
                x.name = 'title';
                x.className = 'form-control';
                x.type = 'text';

                var m = document.createElement('a');
                m.textContent = "Currently: http://localhost:8000/media/" + image;
                m.href = "http://localhost:8000/media/" + image;
                m.target = '_blank';
                m.id = 'current';

                var i = document.createElement('input');
                i.value = "image";
                i.id = 'im';
                i.name = 'image';
                i.className = 'form-control';
                i.type = 'file';

                var y = document.createElement('textarea');
                y.value = description;
                y.id = 'dest';
                y.name = 'description';
                y.rows = '7';
                y.className = 'form-control';
                y.type = 'text';

                var z = document.createElement('input');
                z.value = author;
                z.id = 'au';
                z.name = 'author';
                z.className = 'form-control';
                z.type = 'text';

                var div = document.createElement('div');
                div.appendChild(x);
                div.appendChild(m);
                div.appendChild(i);
                div.appendChild(y);
                div.appendChild(z);

                $("#form").html(div);
          });
        }

        // <!--after getting updating-->
        function USubmit(ref) {
            var u = $(ref).attr('data-url');
            var im = $('#im')[0].files[0];
            if ($('#im').val().length > 1) {
                var reader = new FileReader();
                reader.readAsBinaryString(im);
                reader.onloadend = function () {
                    var base64 = btoa(reader.result);
                    console.log(base64);
                    var tito = $('#tito').val();
                    var dest = $('#dest').val();
                    var au = $('#au').val();
                    console.log(tito);
                    console.log(dest);
                    console.log(au);
                    var data = {
                        blog_title: tito,
                        image: base64,
                        blog_description: dest,
                        author: au,
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
                            blogRedirecting();
                        });
                }
            }else{
                var tito = $('#tito').val();
                    var dest = $('#dest').val();
                    var au = $('#au').val();
                    var data = {
                        blog_title: tito,
                        blog_description: dest,
                        author: au,
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
                            blogRedirecting();
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
            blogRedirecting();
            });
        }