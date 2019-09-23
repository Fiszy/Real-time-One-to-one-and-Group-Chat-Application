@extends('layouts.app')

@section('content')
<div class="container">
<h3 class=" text-center">Messaging</h3>
  <li class="list-group-item active">Chat Room <span class="badge badge-pill badge-warning">@{{ numbusers }}</span></li>
  <div class="badge badge-pill badge-primary" v-if="typing!==''"> @{{ typing }}</div>
<ul class="list-group" v-chat-scroll>


    <message v-for="value,index in chat.message"


    :key=value.index
    :user = chat.user[index]
    :color = chat.color[index]
    :time  = chat.time[index]
    >
        @{{ value }}
    </message>

</ul>
  <input type="text" class="form-control" placeholder="Type your message" v-model="message" @keyup.enter="send" />
</div>

@endsection
