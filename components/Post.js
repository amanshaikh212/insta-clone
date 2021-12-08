import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "@firebase/firestore";

import{
    BookmarkIcon,
    ChatIcon,
    DotsHorizontalIcon,
    EmojiHappyIcon,
    HeartIcon,
    PaperAirplaneIcon
} from "@heroicons/react/outline"

import {
    HeartIcon as HeartIconFilled,
    TrashIcon as TrashIconFilled
} from "@heroicons/react/solid"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { db } from "../firebase";


function Post({id,username,userImg, img, caption}) {
    const { data: session } = useSession();
    const [comment,setComment]=useState("");
    const [comments,setComments] = useState([]);
    const [likes,setLikes] = useState([]);
    const [hasLiked,setHasLiked] = useState(false);
    const [deleteBtn,setDeleteBtn] = useState(false);

    useEffect(()=>
        onSnapshot(
            query(collection(db,"posts",id,"comments"),orderBy("timestamp","desc")),
            (snapshot)=>{
                setComments(snapshot.docs);
            }
        ),
        [db,id]);

    
        useEffect(
            ()=>
            onSnapshot(collection(db,"posts",id,"likes"),(snapshot)=>
            setLikes(snapshot.docs)
            ),
        [db,id]);

        useEffect(()=>{
            setHasLiked(likes.findIndex(like=>like.id === session?.user?.uid) !== -1)
        },[likes])

    const likePost = async ()=>{

        if(hasLiked){
            await deleteDoc(doc(db,'posts',id,'likes',session.user.uid))
        }else{

            
            await setDoc(doc(db,'posts',id,'likes',session.user.uid),{
                username:session.user.username,
            })
        }
    }

    const sendComment = async (e)=>{
        e.preventDefault();

        const commentToSend = comment;

        setComment("");

        await addDoc(collection (db,"posts",id,"comments"),{
            comment: commentToSend,
            username: session?.user?.username,
            userImage: session?.user?.image,
            timestamp: serverTimestamp(),
        });
    };

    return (
        <div className="bg-white my-7 border rounded-sm">
            
            {/*Header*/}
            <div className="flex items-center p-5">
                <img src={userImg} className="rounded-full h-12 w-12 object-contain border p-1 mr-3" alt=""/>
                <p className="flex-1 font-bold">{username}</p>
                <DotsHorizontalIcon className="h-5 w-5 cursor-pointer"/>
            </div>
            {/*Img */}

            <img src={img} className="object-cover w-full" alt=""/>


            {/*Buttons */}
            {session && (
                <div className="flex justify-between px-4 pt-4">
                
                <div className="flex space-x-4">
                    {
                        hasLiked ?(
                            <HeartIconFilled onClick={likePost}  className="btn text-red-500"/>    
                        ):
                        (<HeartIcon className="btn" onClick={likePost} />)
                    }
                    
                    <ChatIcon className="btn"/>
                    <PaperAirplaneIcon className="btn"/>
                </div>
                <BookmarkIcon className="btn"/>
            </div>
            )}
            
            {/*Caption */}
            <div>
                <p className="p-5 truncate">
                    {
                        likes.length > 0 && (
                            <p className="font-bold mb-1">{likes.length} likes</p>
                        )
                    }
                    <span className="font-bold mr-1">{username} </span>{caption}
                </p>
            </div>
            {/*Comments */}
            {
                        comments.length > 0 && (
                            <p className="font-bold p-5 mb-1">{comments.length} comments</p>
                        )
            }


            {comments.length > 0 && (
                <div className="ml-10 h-20 overflow-y-scroll scrollbar-none">
                    {
                        comments.map(comment=>(
                            <div key={comment.id} className="flex items-center space-x-2 mb-3">
                                <img
                                className="h-7 rounded-full"
                                
                                src={comment.data().userImage}/>
                                <p className="text-sm flex-1 ">
                                    <span className="font-bold mr-2">{comment.data().username}</span>
                                    {comment.data().comment}
                                </p>
                                {
                                    session && (session?.user?.username=== comment.data().username) && (
                                        <TrashIconFilled
                                        onClick={
                                            async ()=>{
                                                await deleteDoc(doc(db,'posts',id,'comments',comment.id))
                                            }
                                        }
                                        
                                        
                                        className="btn w-5"/>
                                    )
                                }
                                


                                
                            </div>
                        ))
                    }    
                    
                </div>
            )}



            {/*Inputbox */}
            {session && (

            <form className="flex items-center p-4">
                <EmojiHappyIcon className="h-7"/>
                <input type="text" 
                value={comment} 
                onChange={e=> setComment(e.target.value)} 
                placeholder="Add a comment..." 
                className="border-none flex-1 focus:ring-0 outline-none"/>
                <button  className="font-semibold text-blue-400" type='submit' disabled={!comment.trim()} onClick={sendComment}>Post</button>
            </form>
            )}  
        </div>
    )
}

export default Post