<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

//#DEBUG namespace Flarum\Likes\Notification;
namespace Flarum\Reactions\Notification;

use Flarum\Core\Notification\BlueprintInterface;
use Flarum\Core\Post;
use Flarum\Core\User;

//#DEBUG class PostLikedBlueprint implements BlueprintInterface
class PostReactionsBlueprint implements BlueprintInterface
{
    /**
     * @var Post
     */
    public $post;

    /**
     * @var User
     */
    public $user;

    /**
     * @param Post $post
     * @param User $user
     */
    public function __construct(Post $post, User $user)
    {
        $this->post = $post;
        $this->user = $user;
    }

    /**
     * {@inheritdoc}
     */
    public function getSubject()
    {
        return $this->post;
    }

    /**
     * {@inheritdoc}
     */
    public function getSender()
    {
        return $this->user;
    }

    /**
     * {@inheritdoc}
     */
    public function getData()
    {
        return;
    }

    /**
     * {@inheritdoc}
     */
    public static function getType()
    {
        //#DEBUG return 'postLiked';
        return 'postReactedTo';
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubjectModel()
    {
        return Post::class;
    }
}
