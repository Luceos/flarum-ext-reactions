import { extend } from 'flarum/extend';
import app from 'flarum/app';
import Button from 'flarum/components/Button';
import CommentPost from 'flarum/components/CommentPost';

export default function() {
  extend(CommentPost.prototype, 'actionItems', function(items) {
    const post = this.props.post;

    //#DEBUG if (post.isHidden() || !post.canLike()) return;
    if (post.isHidden() || !post.canReactTo()) return;

    //#DEBUG let isLiked = app.session.user && post.likes().some(user => user === app.session.user);
    let isReactedTo = app.session.user && post.reactions().some(user => user === app.session.user);

    //#DEBUG items.add('like',
    items.add('reaction',
      Button.component({
        children: app.translator.trans(isLiked ? 'flarum-likes.forum.post.unlike_link' : 'flarum-likes.forum.post.like_link'),
        className: 'Button Button--link',
        onclick: () => {
          //#DEBUG isLiked = !isLiked;
          isReactedTo = !isReactedTo;

          //#DEBUG post.save({isLiked});
          post.save({isReactedTo});

          // We've saved the fact that we do or don't like the post, but in order
          // to provide instantaneous feedback to the user, we'll need to add or
          // remove the like from the relationship data manually.
          //#DEBUG const data = post.data.relationships.likes.data;
          const data = post.data.relationships.reactions.data;
          //#DEBUG data.some((like, i) => {
          data.some((reaction, i) => {
            //#DEBUG if (like.id === app.session.user.id()) {
            if (reaction.id === app.session.user.id()) {
              data.splice(i, 1);
              return true;
            }
          });

          //#DEBUG if (isLiked) {
          if (isReactedTo) {
            data.unshift({type: 'users', id: app.session.user.id()});
          }
        }
      })
    );
  });
}
