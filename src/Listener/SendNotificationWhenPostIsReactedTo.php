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
namespace JordanJay29\Reactions\Listener;

use Flarum\Api\Serializer\PostBasicSerializer;
use Flarum\Core\Notification\NotificationSyncer;
use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Event\ConfigureNotificationTypes;
//#DEBUG use Flarum\Likes\Event\PostWasLiked;
use JordanJay29\Reactions\Event\PostWasReactedTo;
//#DEBUG use Flarum\Likes\Event\PostWasUnliked;
use JordanJay29\Reactions\Event\PostWasUnreactedTo;
//#DEBUG use Flarum\Likes\Notification\PostLikedBlueprint;
use JordanJay29\Reactions\Notification\PostReactedTodBlueprint;
use Illuminate\Contracts\Events\Dispatcher;

//#DEBUG class SendNotificationWhenPostIsLiked
class SendNotificationWhenPostIsReactedTo
{
    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @param NotificationSyncer $notifications
     */
    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureNotificationTypes::class, [$this, 'registerNotificationType']);
        //#DEBUG $events->listen(PostWasLiked::class, [$this, 'whenPostWasLiked']);
        $events->listen(PostWasReactedTo::class, [$this, 'whenPostWasReactedTo']);
        //#DEBUG $events->listen(PostWasUnliked::class, [$this, 'whenPostWasUnliked']);
        $events->listen(PostWasUnreactedTo::class, [$this, 'whenPostWasUnreactedTo']);
    }

    /**
     * @param ConfigureNotificationTypes $event
     */
    public function registerNotificationType(ConfigureNotificationTypes $event)
    {
        //#DEBUG $event->add(PostLikedBlueprint::class, PostBasicSerializer::class, ['alert']);
        $event->add(PostReactedTodBlueprint::class, PostBasicSerializer::class, ['alert']);
    }

    /**
     * @param PostWasLiked $event
     */
    //#DEBUG public function whenPostWasLiked(PostWasLiked $event)
    public function whenPostWasReactedTo(PostWasReactedTo $event)
    {
        $this->sync($event->post, $event->user, [$event->post->user]);
    }

    /**
     * @param PostWasUnliked $event
     */
    //#DEBUG public function whenPostWasUnliked(PostWasUnliked $event)
    public function whenPostWasUnreactedTo(PostWasUnreactedTo $event)
    {
        $this->sync($event->post, $event->user, []);
    }

    /**
     * @param Post $post
     * @param User $user
     * @param array $recipients
     */
    public function sync(Post $post, User $user, array $recipients)
    {
        if ($post->user->id != $user->id) {
            $this->notifications->sync(
                //#DEBUG new PostLikedBlueprint($post, $user),
                new PostReactedTodBlueprint($post, $user),
                $recipients
            );
        }
    }
}
