@extends('layouts.new')

@section('content')
        
        <private-chat :user="{{auth()->user()}}"></private-chat>
        
@endsection

