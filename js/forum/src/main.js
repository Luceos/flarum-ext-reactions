import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Post from 'flarum/models/Post';
import Model from 'flarum/Model';
import NotificationGrid from 'flarum/components/NotificationGrid';

//#DEBUG import addLikeAction from 'flarum/likes/addLikeAction';
import addReaction from 'flarum/reactions/addReaction';
//#DEBUG import addLikesList from 'flarum/likes/addLikesList';
import addReactionsList from 'flarum/reactions/addReactionsList';
//#DEBUG import PostLikedNotification from 'flarum/likes/components/PostLikedNotification';
import PostLikedNotification from 'flarum/reactions/components/PostReactionsNotification';

//#DEBUG app.initializers.add('flarum-likes', () => {
app.initializers.add('flarum-reactions', () => {
  //#DEBUG app.notificationComponents.postLiked = PostLikedNotification;
  app.notificationComponents.postReactedTo = PostReactionsNotification;

  //#DEBUG Post.prototype.canLike = Model.attribute('canLike');
  Post.prototype.canReactTo = Model.attribute('canReactTo');
  //#DEBUG Post.prototype.likes = Model.hasMany('likes');
  Post.prototype.reactions = Model.hasMany('reactions');

  //#DEBUG addLikeAction();
  addReaction();
  //#DEBUG addLikesList();
  addReactionsList();

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    //#DEBUG items.add('postLiked', {
    items.add('postReactdTo', {
      //#DEBUG name: 'postLiked',
      name: 'postReactedTo',
      icon: 'thumbs-o-up',
      label: app.translator.trans('flarum-likes.forum.settings.notify_post_liked_label')
    });
  });
});
