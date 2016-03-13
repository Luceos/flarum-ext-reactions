System.register('jordanjay29/reactions/addReaction', ['flarum/extend', 'flarum/app', 'flarum/components/Button', 'flarum/components/CommentPost'], function (_export) {
  'use strict';

  var extend, app, Button, CommentPost;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumComponentsButton) {
      Button = _flarumComponentsButton['default'];
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost['default'];
    }],
    execute: function () {
      _export('default', function () {
        extend(CommentPost.prototype, 'actionItems', function (items) {
          var post = this.props.post;

          //#DEBUG if (post.isHidden() || !post.canLike()) return;
          if (post.isHidden() || !post.canReactTo()) return;

          //#DEBUG let isLiked = app.session.user && post.likes().some(user => user === app.session.user);
          var isReactedTo = app.session.user && post.reactions().some(function (user) {
            return user === app.session.user;
          });

          //#DEBUG items.add('like',
          items.add('reaction', Button.component({
            children: app.translator.trans(isLiked ? 'flarum-likes.forum.post.unlike_link' : 'flarum-likes.forum.post.like_link'),
            className: 'Button Button--link',
            onclick: function onclick() {
              //#DEBUG isLiked = !isLiked;
              isReactedTo = !isReactedTo;

              //#DEBUG post.save({isLiked});
              post.save({ isReactedTo: isReactedTo });

              // We've saved the fact that we do or don't like the post, but in order
              // to provide instantaneous feedback to the user, we'll need to add or
              // remove the like from the relationship data manually.
              //#DEBUG const data = post.data.relationships.likes.data;
              var data = post.data.relationships.reactions.data;
              //#DEBUG data.some((like, i) => {
              data.some(function (reaction, i) {
                //#DEBUG if (like.id === app.session.user.id()) {
                if (reaction.id === app.session.user.id()) {
                  data.splice(i, 1);
                  return true;
                }
              });

              //#DEBUG if (isLiked) {
              if (isReactedTo) {
                data.unshift({ type: 'users', id: app.session.user.id() });
              }
            }
          }));
        });
      });
    }
  };
});;
System.register('jordanjay29/reactions/addReactionList', ['flarum/extend', 'flarum/app', 'flarum/components/CommentPost', 'flarum/helpers/punctuateSeries', 'flarum/helpers/username', 'flarum/helpers/icon', 'jordanjay29/reactions/components/PostReactionsModal'], function (_export) {
  'use strict';

  //#DEBUG import PostLikesModal from 'flarum/likes/components/PostLikesModal';
  var extend, app, CommentPost, punctuateSeries, username, icon, PostReactionsModal;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumComponentsCommentPost) {
      CommentPost = _flarumComponentsCommentPost['default'];
    }, function (_flarumHelpersPunctuateSeries) {
      punctuateSeries = _flarumHelpersPunctuateSeries['default'];
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername['default'];
    }, function (_flarumHelpersIcon) {
      icon = _flarumHelpersIcon['default'];
    }, function (_jordanjay29ReactionsComponentsPostReactionsModal) {
      PostReactionsModal = _jordanjay29ReactionsComponentsPostReactionsModal['default'];
    }],
    execute: function () {
      _export('default', function () {
        extend(CommentPost.prototype, 'footerItems', function (items) {
          var post = this.props.post;
          //#DEBUG const likes = post.likes();
          var reactions = post.reactions();

          //#DEBUG if (likes && likes.length) {
          if (reactions && reactions.length) {
            var limit = 4;
            //#DEBUG const overLimit = likes.length > limit;
            var overLimit = reactions.length > limit;

            // Construct a list of names of users who have liked this post. Make sure the
            // current user is first in the list, and cap a maximum of 4 items.
            //#DEBUG const names = likes.sort(a => a === app.session.user ? -1 : 1)
            var names = reactions.sort(function (a) {
              return a === app.session.user ? -1 : 1;
            }).slice(0, overLimit ? limit - 1 : limit).map(function (user) {
              return m(
                'a',
                { href: app.route.user(user), config: m.route },
                user === app.session.user ? app.translator.trans('flarum-likes.forum.post.you_text') : username(user)
              );
            });

            // If there are more users that we've run out of room to display, add a "x
            // others" name to the end of the list. Clicking on it will display a modal
            // with a full list of names.
            if (overLimit) {
              //#DEBUG const count = likes.length - names.length;
              var count = reactions.length - names.length;

              names.push(m(
                'a',
                { href: '#', onclick: function (e) {
                    e.preventDefault();
                    //#DEBUG app.modal.show(new PostLikesModal({post}));
                    app.modal.show(new PostReactionsModal({ post: post }));
                  } },
                app.translator.transChoice('flarum-likes.forum.post.others_link', count, { count: count })
              ));
            }

            //#DEBUG items.add('liked', (
            //#DEBUG <div className="Post-likedBy">
            //#DEBUG {app.translator.transChoice('flarum-likes.forum.post.liked_by' + (likes[0] === app.session.user ? '_self' : '') + '_text', names.length, {
            items.add('reactedTo', m(
              'div',
              { className: 'Post-reactedToBy' },
              icon('thumbs-o-up'),
              app.translator.transChoice('flarum-likes.forum.post.liked_by' + (reactions[0] === app.session.user ? '_self' : '') + '_text', names.length, {
                count: names.length,
                users: punctuateSeries(names)
              })
            ));
          }
        });
      });
    }
  };
});;
System.register('jordanjay29/reactions/components/PostReactionsModal', ['flarum/components/Modal', 'flarum/helpers/avatar', 'flarum/helpers/username'], function (_export) {

  //#DEBUG export default class PostLikesModal extends Modal {
  'use strict';

  var Modal, avatar, username, PostReactionsModal;
  return {
    setters: [function (_flarumComponentsModal) {
      Modal = _flarumComponentsModal['default'];
    }, function (_flarumHelpersAvatar) {
      avatar = _flarumHelpersAvatar['default'];
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername['default'];
    }],
    execute: function () {
      PostReactionsModal = (function (_Modal) {
        babelHelpers.inherits(PostReactionsModal, _Modal);

        function PostReactionsModal() {
          babelHelpers.classCallCheck(this, PostReactionsModal);
          babelHelpers.get(Object.getPrototypeOf(PostReactionsModal.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(PostReactionsModal, [{
          key: 'className',
          value: function className() {
            //#DEBUG return 'PostLikesModal Modal--small';
            return 'PostReactionsModal Modal--small';
          }
        }, {
          key: 'title',
          value: function title() {
            return app.translator.trans('flarum-likes.forum.post_likes.title');
          }

          //#DEBUG <ul className="PostLikesModal-list">
          //#DEBUG {this.props.post.likes().map(user =>
        }, {
          key: 'content',
          value: function content() {
            return m(
              'div',
              { className: 'Modal-body' },
              m(
                'ul',
                { className: 'PostReactionsModal-list' },
                this.props.post.reactions().map(function (user) {
                  return m(
                    'li',
                    null,
                    m(
                      'a',
                      { href: app.route.user(user), config: m.route },
                      avatar(user),
                      ' ',
                      ' ',
                      username(user)
                    )
                  );
                })
              )
            );
          }
        }]);
        return PostReactionsModal;
      })(Modal);

      _export('default', PostReactionsModal);
    }
  };
});;
System.register('jordanjay29/reactions/components/PostReactionsNotification', ['flarum/components/Notification', 'flarum/helpers/username', 'flarum/helpers/punctuateSeries'], function (_export) {

  //#DEBUG export default class PostLikedNotification extends Notification {
  'use strict';

  var Notification, username, punctuateSeries, PostReactionsNotification;
  return {
    setters: [function (_flarumComponentsNotification) {
      Notification = _flarumComponentsNotification['default'];
    }, function (_flarumHelpersUsername) {
      username = _flarumHelpersUsername['default'];
    }, function (_flarumHelpersPunctuateSeries) {
      punctuateSeries = _flarumHelpersPunctuateSeries['default'];
    }],
    execute: function () {
      PostReactionsNotification = (function (_Notification) {
        babelHelpers.inherits(PostReactionsNotification, _Notification);

        function PostReactionsNotification() {
          babelHelpers.classCallCheck(this, PostReactionsNotification);
          babelHelpers.get(Object.getPrototypeOf(PostReactionsNotification.prototype), 'constructor', this).apply(this, arguments);
        }

        babelHelpers.createClass(PostReactionsNotification, [{
          key: 'icon',
          value: function icon() {
            return 'thumbs-o-up';
          }
        }, {
          key: 'href',
          value: function href() {
            return app.route.post(this.props.notification.subject());
          }
        }, {
          key: 'content',
          value: function content() {
            var notification = this.props.notification;
            var user = notification.sender();
            var auc = notification.additionalUnreadCount();

            return app.translator.transChoice('flarum-likes.forum.notifications.post_liked_text', auc + 1, {
              user: user,
              username: auc ? punctuateSeries([username(user), app.translator.transChoice('flarum-likes.forum.notifications.others_text', auc, { count: auc })]) : undefined
            });
          }
        }, {
          key: 'excerpt',
          value: function excerpt() {
            return this.props.notification.subject().contentPlain();
          }
        }]);
        return PostReactionsNotification;
      })(Notification);

      _export('default', PostReactionsNotification);
    }
  };
});;
System.register('jordanjay29/reactions/main', ['flarum/extend', 'flarum/app', 'flarum/models/Post', 'flarum/Model', 'flarum/components/NotificationGrid', 'jordanjay29/reactions/addReaction', 'jordanjay29/reactions/addReactionsList', 'jordanjay29/reactions/components/PostReactionsNotification'], function (_export) {

  //#DEBUG app.initializers.add('flarum-likes', () => {
  //#DEBUG import addLikesList from 'flarum/likes/addLikesList';
  'use strict';

  //#DEBUG import PostLikedNotification from 'flarum/likes/components/PostLikedNotification';

  //#DEBUG import addLikeAction from 'flarum/likes/addLikeAction';
  var extend, app, Post, Model, NotificationGrid, addReaction, addReactionsList, PostLikedNotification;
  return {
    setters: [function (_flarumExtend) {
      extend = _flarumExtend.extend;
    }, function (_flarumApp) {
      app = _flarumApp['default'];
    }, function (_flarumModelsPost) {
      Post = _flarumModelsPost['default'];
    }, function (_flarumModel) {
      Model = _flarumModel['default'];
    }, function (_flarumComponentsNotificationGrid) {
      NotificationGrid = _flarumComponentsNotificationGrid['default'];
    }, function (_jordanjay29ReactionsAddReaction) {
      addReaction = _jordanjay29ReactionsAddReaction['default'];
    }, function (_jordanjay29ReactionsAddReactionsList) {
      addReactionsList = _jordanjay29ReactionsAddReactionsList['default'];
    }, function (_jordanjay29ReactionsComponentsPostReactionsNotification) {
      PostLikedNotification = _jordanjay29ReactionsComponentsPostReactionsNotification['default'];
    }],
    execute: function () {
      app.initializers.add('jordanjay29-reactions', function () {
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
    }
  };
});