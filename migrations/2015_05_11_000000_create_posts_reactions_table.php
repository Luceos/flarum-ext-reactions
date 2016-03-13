<?php
/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/* For Beta 5
use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    //#DEBUG 'posts_likes',
    'posts_reactions',
    function (Blueprint $table) {
        $table->integer('post_id')->unsigned();
        $table->integer('user_id')->unsigned();
        $table->primary(['post_id', 'user_id']);
    }
);
*/

namespace jordanjay29\reactions\Migration;

use Flarum\Database\AbstractMigration;
use Illuminate\Database\Schema\Blueprint;

class CreatePostsReactionsTable extends AbstractMigration
{
    public function up()
    {
        $this->schema->create('posts_reactions', function (Blueprint $table) {
            $table->integer('post_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->primary(['post_id', 'user_id']);
        });
    }
    public function down()
    {
        $this->schema->drop('posts_reactions');
    }
}
