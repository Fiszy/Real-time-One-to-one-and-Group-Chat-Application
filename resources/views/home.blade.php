@extends('layouts.new')

@section('content')

        <Chat :user="{{auth()->user()}}"></Chat>
@endsection
