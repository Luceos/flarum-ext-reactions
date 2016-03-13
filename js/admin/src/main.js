import { extend } from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';

//#DEBUG app.initializers.add('flarum-likes', () => {
app.initializers.add('flarum-reactions', () => {
  extend(PermissionGrid.prototype, 'replyItems', items => {
    //#DEBUG items.add('likePosts', {
    items.add('reactToPosts', {
      icon: 'thumbs-o-up',
      label: app.translator.trans('flarum-likes.admin.permissions.like_posts_label'),
      //#DEBUG permission: 'discussion.likePosts'
      permission: 'discussion.reactToPosts'
    });
  });
});
