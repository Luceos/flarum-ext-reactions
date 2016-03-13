System.register('flarum/reactions/main', ['flarum/extend', 'flarum/app', 'flarum/components/PermissionGrid'], function (_export) {

  //#DEBUG app.initializers.add('flarum-likes', () => {
  'use strict';

  var extend, app, PermissionGrid;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumComponentsPermissionGrid) {
      PermissionGrid = _flarumComponentsPermissionGrid['default'];
    }],
    execute: function () {
      app.initializers.add('flarum-reactions', function () {
        extend(PermissionGrid.prototype, 'replyItems', function (items) {
          //#DEBUG items.add('likePosts', {
          items.add('reactToPosts', {
            icon: 'thumbs-o-up',
            label: app.translator.trans('flarum-likes.admin.permissions.like_posts_label'),
            //#DEBUG permission: 'discussion.likePosts'
            permission: 'discussion.reactToPosts'
          });
        });
      });
    }
  };
});