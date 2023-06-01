<?php

    namespace Controllers;

    use Models\posts;
    use Models\comments;
    use Models\user;
    use Models\interactions;
    use Controllers\auth\LoginController as LoginController;

    class PostController {

        private $userId;
        private $title;
        private $body;

        public function __construct(){
            $ua = new LoginController();
            $ua->sessionValidate();
            $this->userId = $ua->id;
        }

        public function getPosts($limit="",$pid = ""){
            $posts = new posts();
            $resultP = $posts->select(['a.id','a.title','a.body','date_format(a.created_at,"%d/%m/%Y") as fecha','b.name'])
                            ->join('user b','a.userId=b.id')
                            ->where( $pid != "" ? [['a.id',$pid], ['active', '1']] : [['active', '1']])
                            ->orderBy([['a.created_at','DESC']])
                            ->limit($limit)
                            ->get();
            if($pid != "" || $limit == 1){
                $comments = new comments();
                $resultC = $comments->select(['id'])
                                    ->count()
                                    ->where([['postId', json_decode($resultP)[0]->id]])
                                    ->get();
                $interacts = new interactions();
                $resultI = $interacts->select(['id'])->count()
                                     ->where([['postId', json_decode($resultP)[0]->id]])
                                     ->get();
                $resultMI = $interacts->select(['id'])->count()
                                      ->where([['postId', json_decode($resultP)[0]->id],
                                               ['userId', $this->userId]])
                                      ->get();
                $result = json_encode(array_merge(
                            json_decode($resultP),
                            json_decode($resultC),
                            json_decode($resultI),
                            json_decode($resultMI)));
            }else{
                $result = $resultP;
            }
            return $result;
        }

        public function newPost($datos){
            $post = new posts();
            $post->valores = [null,$datos['uid'],$datos['title'],$datos['body'],null];
            $result = $post->create();
            return;
            die;
        }

        public function getMyPosts($uid){
            $posts = new posts();
            $result = $posts->where([['userId',$this->userId]])->get();
            return $result;                
        }

        public function countPostComments($pid){
            $comments = new comments();
            $result = $comments->count()->where([['postId', $pid]])->get();
            return $result;
        }

        public function togglePostActive($pid){
            $post = new posts();
            $result = $post->where([['id', $pid]])->updateBusquetsEdition([['active', 'not active']]);
        }

        public function deletePost($pid){
            $deletePost = new posts();
            $result = $deletePost->where([['id',$pid]])->delete();
            return $result;                
        }

        public function saveComment($datos){
            $comment = new comments();
            $user = new user();
            $u = $user->select(['name', 'email'])->where([['id', $this->userId]])->get();
            $u = json_decode($u);
            $comment->valores = [$datos['pid'], $u[0]->name, $u[0]->email, $datos['comment']];
            print_r($comment->create());
        }

        public function editPost($datos){
            date_default_timezone_set('America/Mexico_City');
            $edit = new posts();
            $edit->valores = [$datos['pid'], $this->userId, $datos['title'], $datos['body'], date('Y-m-d H:i:s')];
            $result = $edit->where([['id', $datos['pid']]])->update();
            return $result;
        }

        public function getPostComments($pid){
            $comments = new comments();
            $result = $comments->select(['name', 'comment'])
                               ->where([['postId', $pid]])
                               ->orderBy([['created_at', 'DESC']])
                               ->get();
            return $result;
        }

        public function toggleLike($uid, $pid){
            $like = new interactions();
            $like_exists = $like->select(['id'])
                                ->where([['postId', $pid], ['userId', $uid]])
                                ->get();
            if(count(json_decode($like_exists)) == 0){
                $like->valores = [$uid, $pid, 1];
                $like->create();
            }else{
                $like->where([['postId', $pid], ['userId', $uid]])->delete();
            }
            return $like->count()->where([['postId', $pid]])->get();
        }
    }