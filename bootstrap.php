<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//#DEBUG use Flarum\Likes\Listener;
use JordanJay29\Reactions\Listener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    //#DEBUG $events->subscribe(Listener\AddPostLikesRelationship::class);
    $events->subscribe(Listener\AddPostReactionsRelationship::class);
    //#DEBUG $events->subscribe(Listener\SaveLikesToDatabase::class);
    $events->subscribe(Listener\SaveReactionsToDatabase::class);
    //#DEBUG $events->subscribe(Listener\SendNotificationWhenPostIsLiked::class);
    $events->subscribe(Listener\SendNotificationWhenPostIsReactedTo::class);
};
