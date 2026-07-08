<?php

use App\Models\User;

test('home renders the marketing landing page by default', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Welcome')
            ->has('canRegister'));
});

test('home still renders the landing page for signed in users', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Welcome'));
});

test('home redirects to registration when the landing page is disabled and the instance has no owner yet', function () {
    config(['relay.show_landing_page' => false]);

    $this->get(route('home'))->assertRedirect(route('register'));
});

test('home redirects to login when the landing page is disabled and the instance already has an owner', function () {
    config(['relay.show_landing_page' => false]);
    User::factory()->create();

    $this->get(route('home'))->assertRedirect(route('login'));
});
