function bannerRedirecting() {
            $.ajax({
                method: "GET",
                url: "http://localhost:8000/panel/api/banner/",
            })
                .done(function (msg) {
                    var data = JSON.parse(msg);
                    var html = "";
                    for (var i = 0; i < data.length; i++) {
                        var h = "<tr>";
                        var url = "http://localhost:8000/panel/api/retrievebanner/0";
                        url = url.slice(0, url.length - 1) + data[i].id;
                        url = "data-url=" + url;
                        h += "<td>" + data[i].id + "</td>";
                        h += "<td>" + data[i].title + "</td>";
                        h += "<td>" + data[i].code + "</td>";
                        h += "<td>" + data[i].short_description + "</td>";
                        h += "<td><a href='" + data[i].image + "' target='_blank'>" + data[i].image + "</a></td>";
                        h += "<td>" + data[i].number + "</td>";
                        h += "<td>" + '<button class="btn btn-primary btn-sm fa fa-edit"' + url + ' data-toggle="modal" data-target="#Update" onclick="bannerUpdate(this)"></button>' + "</td>"
                        h += "<td>" + '<button class="btn btn-primary btn-sm fa fa-trash"' + url + ' data-toggle="modal" data-target="#Delete" onclick="bannerDelete(this)"></button>' + "</td>"
                        h += "</tr>";
                        html += h;
                    }
                    $("#blog").html(html);
                });
        }

        bannerRedirecting();

        $(document).on('submit', '#adding', function (e) {
            e.preventDefault();
            var img = $('#img')[0].files[0];
            if ($('#tit').val().length < 1) {
                $('#title').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#cod').val().length < 1) {
                $('#code').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#des').val().length < 1) {
                $('#short_description').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#img').val().length < 1) {
                $('#image').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            if ($('#num').val().length < 1) {
                $('#number').html("<span class='errorlist'>This field may not be blank.</span>");
            }
            var reader = new FileReader();
            reader.readAsBinaryString(img);
            reader.onloadend = function () {
                var base64 = btoa(reader.result);
                console.log(base64);
                var title = $('#tit').val();
                var code = $('#cod').val();
                var desc = $('#des').val();
                var number = $('#num').val();
                var data = {
                    title: title,
                    code: code,
                    short_description: desc,
                    image: base64,
                    number: number,
                };
                console.log(data);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8000/panel/api/banner/',
                    headers: {
                        'X-CSRFToken': "{{ csrf_token }}",
                    },
                    data: data,
                    success: function (res) {
                        if (res.status == 'ok') {
                            bannerRedirecting();
                            document.getElementById("adding").reset();
                            $('#completed').html("<span class='successMsg'>" + res.message + "</span>");
                            $('#title').html("");
                            $('#code').html("");
                            $('#short_description').html("");
                            $('#image').html("");
                            $('#number').html("");
                        } else if (res.status == "error") {
                            var keys = Object.keys(res.message);
                            console.log(keys);
                            for (var i = 0; i < keys.length; i++) {
                                var msg = res.message[keys[i]];
                                var key = keys[i];
                                $('#' + key).html("<span class='errorlist'>" + msg + "</span>");
                            }
                        }
                    }
                });
            };
        });

        //
        <!--Update getting-->
        function bannerUpdate(ref) {
            var u = $(ref).attr('data-url');
            $('#update-user').attr('data-url', u);
            $.ajax({
                type: "GET",
                url: u,
            })
                .done(function (msg) {
                    var title = msg.title;
                    var code = msg.code;
                    var short_description = msg.short_description;
                    var image = 'image';
                    var number = msg.number;

                    var x = document.createElement('input');
                    x.value = title;
                    x.id = 'tito';
                    x.name = 'title';
                    x.className = 'form-control';
                    x.type = 'text';

                    var c = document.createElement('input');
                    c.value = code;
                    c.id = 'co';
                    c.name = 'code';
                    c.className = 'form-control';
                    c.type = 'text';

                    var s = document.createElement('input');
                    s.value = short_description;
                    s.id = 'sh';
                    s.name = 'short';
                    s.className = 'form-control';
                    s.type = 'text';

                    var i = document.createElement('input');
                    i.value = image;
                    i.id = 'im';
                    i.name = 'image';
                    i.className = 'form-control';
                    i.type = 'file';

                    var y = document.createElement('input');
                    y.value = number;
                    y.id = 'no';
                    y.name = 'number';
                    y.className = 'form-control';
                    y.type = 'text';


                    var div = document.createElement('div');
                    div.appendChild(x);
                    div.appendChild(c);
                    div.appendChild(s);
                    div.appendChild(i);
                    div.appendChild(y);

                    $("#form").html(div);
                });
        }

        //
        <!--after getting updating-->
        function bansUSubmit(ref) {
            var u = $(ref).attr('data-url');
            var im = $('#im')[0].files[0];
            if ($('#im').val().length > 1) {
                var reader = new FileReader();
                reader.readAsBinaryString(im);
                reader.onloadend = function () {
                    var base64 = btoa(reader.result);
                    console.log(base64);
                    var tito = $('#tito').val();
                    var code = $('#co').val();
                    var short = $('#sh').val();
                    var number = $('#no').val();
                    var data = {
                        title: tito,
                        code: code,
                        short_description: short,
                        image: base64,
                        number: number,
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
                            bannerRedirecting();
                        });
                }
            } else {
                var tito = $('#tito').val();
                var code = $('#co').val();
                var short = $('#sh').val();
                var number = $('#no').val();
                var data = {
                    title: tito,
                    code: code,
                    short_description: short,
                    number: number,
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
                        bannerRedirecting();
                    });
            }
        }

        //
        <!--Delete getting-->
        function bannerDelete(ref) {
            var u = $(ref).attr('data-url');
            $('#delete-blog').attr('data-url', u);
        }

        <!-- after getting Deleting-->
        function bansDSubmit(ref) {
            var u = $(ref).attr('data-url');
            $.ajax({
                type: "DELETE",
                url: u,
                headers: {
                    "X-CSRFToken": "{{csrf_token}}"
                }
            })
                .done(function (msg) {
                    console.log(msg);
                    bannerRedirecting();
                });
        }