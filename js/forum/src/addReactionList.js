import { extend } from 'flarum/extend';
import app from 'flarum/app';
import CommentPost from 'flarum/components/CommentPost';
import punctuateSeries from 'flarum/helpers/punctuateSeries';
import username from 'flarum/helpers/username';
import icon from 'flarum/helpers/icon';

//#DEBUG import PostLikesModal from 'flarum/likes/components/PostLikesModal';
import PostReactionsModal from 'flarum/reactions/components/PostReactionsModal';

export default function() {
  extend(CommentPost.prototype, 'footerItems', function(items) {
    const post = this.props.post;
    //#DEBUG const likes = post.likes();
    const reactions = post.reactions();

    //#DEBUG if (likes && likes.length) {
    if (reactions && reactions.length) {
      const limit = 4;
      //#DEBUG const overLimit = likes.length > limit;
      const overLimit = reactions.length > limit;

      // Construct a list of names of users who have liked this post. Make sure the
      // current user is first in the list, and cap a maximum of 4 items.
      //#DEBUG const names = likes.sort(a => a === app.session.user ? -1 : 1)
      const names = reactions.sort(a => a === app.session.user ? -1 : 1)
        .slice(0, overLimit ? limit - 1 : limit)
        .map(user => {
          return (
            <a href={app.route.user(user)} config={m.route}>
              {user === app.session.user ? app.translator.trans('flarum-likes.forum.post.you_text') : username(user)}
            </a>
          );
        });

      // If there are more users that we've run out of room to display, add a "x
      // others" name to the end of the list. Clicking on it will display a modal
      // with a full list of names.
      if (overLimit) {
        //#DEBUG const count = likes.length - names.length;
        const count = reactions.length - names.length;

        names.push(
          <a href="#" onclick={e => {
            e.preventDefault();
            //#DEBUG app.modal.show(new PostLikesModal({post}));
            app.modal.show(new PostReactionsModal({post}));
          }}>
            {app.translator.transChoice('flarum-likes.forum.post.others_link', count, {count})}
          </a>
        );
      }

      //#DEBUG items.add('liked', (
      //#DEBUG <div className="Post-likedBy">
      //#DEBUG {app.translator.transChoice('flarum-likes.forum.post.liked_by' + (likes[0] === app.session.user ? '_self' : '') + '_text', names.length, {
      items.add('reactedTo', (
        <div className="Post-reactedToBy">
          {icon('thumbs-o-up')}
          {app.translator.transChoice('flarum-likes.forum.post.liked_by' + (reactions[0] === app.session.user ? '_self' : '') + '_text', names.length, {
            count: names.length,
            users: punctuateSeries(names)
          })}
        </div>
      ));
    }
  });
}
