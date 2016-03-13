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

use Flarum\Api\Controller;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Api\Serializer\UserBasicSerializer;
use Flarum\Core\Post;
use Flarum\Core\User;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\GetModelRelationship;
use Flarum\Event\PrepareApiAttributes;
use Illuminate\Contracts\Events\Dispatcher;

//#DEBUG class AddPostLikesRelationship
class AddPostReactionssRelationship
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetModelRelationship::class, [$this, 'getModelRelationship']);
        $events->listen(GetApiRelationship::class, [$this, 'getApiAttributes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
        //#DEBUG $events->listen(ConfigureApiController::class, [$this, 'includeLikes']);
        $events->listen(ConfigureApiController::class, [$this, 'includeReactions']);
    }

    /**
     * @param GetModelRelationship $event
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany|null
     */
    public function getModelRelationship(GetModelRelationship $event)
    {
        //#DEBUG if ($event->isRelationship(Post::class, 'likes')) {
        if ($event->isRelationship(Post::class, 'reactions')) {
            //#DEBUG return $event->model->belongsToMany(User::class, 'posts_likes', 'post_id', 'user_id', 'likes');
            return $event->model->belongsToMany(User::class, 'posts_reactions', 'post_id', 'user_id', 'reactions');
        }
    }

    /**
     * @param GetApiRelationship $event
     * @return \Tobscure\JsonApi\Relationship|null
     */
    public function getApiAttributes(GetApiRelationship $event)
    {
        //#DEBUG if ($event->isRelationship(PostSerializer::class, 'likes')) {
        if ($event->isRelationship(PostSerializer::class, 'reactions')) {
            //#DEBUG return $event->serializer->hasMany($event->model, UserBasicSerializer::class, 'likes');
            return $event->serializer->hasMany($event->model, UserBasicSerializer::class, 'reactions');
        }
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            //#DEBUG $event->attributes['canLike'] = (bool) $event->actor->can('like', $event->model);
            $event->attributes['canReactTo'] = (bool) $event->actor->can('react', $event->model);
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    //#DEBUG public function includeLikes(ConfigureApiController $event)
    public function includeReactions(ConfigureApiController $event)
    {
        if ($event->isController(Controller\ShowDiscussionController::class)) {
            //#DEBUG $event->addInclude('posts.likes');
            $event->addInclude('posts.reactions');
        }

        if ($event->isController(Controller\ListPostsController::class)
            || $event->isController(Controller\ShowPostController::class)
            || $event->isController(Controller\CreatePostController::class)
            || $event->isController(Controller\UpdatePostController::class)) {
            //#DEBUG $event->addInclude('likes');
            $event->addInclude('reactions');
        }
    }
}
