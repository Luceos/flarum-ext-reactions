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
use Flarum\Core\Group;
use Flarum\Core\Permission;

$getPermissionAttributes = function () {
    return [
        'group_id' => Group::MEMBER_ID,
        //#DEBUG 'permission' => 'discussion.likePosts',
        'permission' => 'discussion.reactToPosts',
    ];
};

return [
    'up' => function () use ($getPermissionAttributes) {
        Permission::unguard();

        $permission = Permission::firstOrNew($getPermissionAttributes());

        $permission->save();
    },

    'down' => function () use ($getPermissionAttributes) {

        Permission::where($getPermissionAttributes())->delete();
    }
];
*/

namespace jordanjay29\reactions\Migration;

use Flarum\Core\Group;
use Flarum\Core\Permission;
use Flarum\Database\AbstractMigration;

class AddDefaultReactToPermissions extends AbstractMigration
{
    public function up()
    {
        Permission::unguard();

        $permission = Permission::firstOrNew($this->getPermissionAttributes());

        $permission->save();
    }

    public function down()
    {
        Permission::where($this->getPermissionAttributes())->delete();
    }

    /**
     * @return array
     */
    protected function getPermissionAttributes()
    {
        return [
            'group_id' => Group::MEMBER_ID,
            'permission' => 'discussion.reactToPosts'
        ];
    }
}
