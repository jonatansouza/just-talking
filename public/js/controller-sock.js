function clearChat() {
    $('#chat').empty();
    $('#message').focus();
}
$(function() {
    $("#message").keyup(function(event) {
        if (event.keyCode == 13) {
            $("#sendMessage").click();
        }
    });

    moment.locale('br');
    var socket = io.connect();
    var $messageForm = $('#messageForm');
    var $message = $('#message');
    var $chat = $('#chat');
    var $messageArea = $('#messageArea');
    var $userFormArea = $('#userFormArea');
    var $userForm = $('#userForm');
    var $users = $('#users');
    var $username = $('#userSession').val();

    $messageForm.submit(function(e) {

        e.preventDefault();

        (function($) {
            $.sanitize = function(input) {
                var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                replace(/<[\/\!]*?[^<>]*?>/gi, '').
                replace(/<style[^>]*?>.*?<\/style>/gi, '').
                replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
                return output;
            };
        })(jQuery);

        var m = $.sanitize($message.val());
        if (m) {
            socket.emit('send message', m);
            $message.val('');
            $message.focus();
        } else {
            $message.val('');
            $message.focus();
        }
    });

    socket.on('new message', function(data) {
        if ($(".usernames").last().text() === data.user) {
            $chat.children('.well').last().append('<p>' + data.msg + ' <span class="pull-right"><small>' + moment().calendar() + '</smal></span ></p>');
        } else {
            $chat.append('<div class="well"><p><strong class="text-info"><span class="usernames">' + data.user + '</span> Diz: </strong></p><p>' + data.msg + ' <span class="pull-right"><small>' + moment().calendar() +
                '</smal></span ></p></div>');
        }

    });

    socket.emit('new username', $username, function(data) {
        console.log(data+ "added");
    });

    socket.on('new user in', function(data){
      $chat.append('<div class="well well-success"><strong class="text-success"><span class="usernameStatus">' + data + '</span></strong> entrou no chat  <span class="pull-right"><small>' + moment().calendar() +
          '</smal></span ></div>');
    });

    socket.on('user off', function(data) {
        if (data != $username) {
            $chat.append('<div class="well well-warning"><strong class="text-warning"><span class="usernameStatus">' + data + '</span></strong> está offline agora <span class="pull-right"><small>' + moment().calendar() +
                '</smal></span ></div>')
        }
    });

    socket.on('get users', function(data) {
        var html = '';
        for (i = 0; i < data.length; i++) {
            html += '<li class="list-group-item"><a href="/users/'+ data[i]+ '" >' + data[i] + '</a></li>';
        }
        $users.html(html);
    });
});
