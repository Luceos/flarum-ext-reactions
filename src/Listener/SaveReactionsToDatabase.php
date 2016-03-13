<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//#DEBUG namespace Flarum\Likes\Listener;
namespace Flarum\Reactions\Listener;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWillBeSaved;
//#DEBUG use Flarum\Likes\Event\PostWasLiked;
use Flarum\Reactions\Event\PostWasReactedTo;
//#DEBUG use Flarum\Likes\Event\PostWasUnliked;
use Flarum\Reactions\Event\PostWasUnreactedTo;
use Illuminate\Contracts\Events\Dispatcher;

//#DEBUG class SaveReactionsToDatabase
class SaveReactionsToDatabase
{
    use AssertPermissionTrait;

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWillBeSaved::class, [$this, 'whenPostWillBeSaved']);
        $events->listen(PostWasDeleted::class, [$this, 'whenPostWasDeleted']);
    }

    /**
     * @param PostWillBeSaved $event
     */
    public function whenPostWillBeSaved(PostWillBeSaved $event)
    {
        $post = $event->post;
        $data = $event->data;

        //#DEBUG if ($post->exists && isset($data['attributes']['isLiked'])) {
        if ($post->exists && isset($data['attributes']['isReactedTo'])) {
            $actor = $event->actor;
            //#DEBUG $liked = (bool) $data['attributes']['isLiked'];
            $reactedTo = (bool) $data['attributes']['isReactedTo'];

            //#DEBUG $this->assertCan($actor, 'like', $post);
            $this->assertCan($actor, 'react', $post);

            //#DEBUG $currentlyLiked = $post->likes()->where('user_id', $actor->id)->exists();
            $currentlyReactedTo = $post->reactions()->where('user_id', $actor->id)->exists();

            //#DEBUG if ($liked && ! $currentlyLiked) {
            if ($reactedTo && ! $currentlyReactedTo) {
                //#DEBUG $post->likes()->attach($actor->id);
                $post->reactions()->attach($actor->id);

                //#DEBUG $post->raise(new PostWasLiked($post, $actor));
                $post->raise(new PostWasReactedTo($post, $actor));
            //#DEBUG } elseif ($currentlyLiked) {
            } elseif ($currentlyReactedTo) {
                //#DEBUG $post->likes()->detach($actor->id);
                $post->reactions()->detach($actor->id);

                //#DEBUG $post->raise(new PostWasUnliked($post, $actor));
                $post->raise(new PostWasUnreactedTo($post, $actor));
            }
        }
    }

    /**
     * @param PostWasDeleted $event
     */
    public function whenPostWasDeleted(PostWasDeleted $event)
    {
        //#DEBUG $event->post->likes()->detach();
        $event->post->reactions()->detach();
    }
}
