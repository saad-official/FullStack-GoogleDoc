import  { useCallback, useEffect, useState } from 'react';
import Quill ,{ DeltaStatic } from 'quill';
import 'quill/dist/quill.snow.css';
import { io,  Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
const SAVE_DOCUMENT = 2000;

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]
  
function TextEditor() {
    const [socket, setSocket] = useState<Socket | null>(null); // Specify Socket type
    const [quil, setQuil] = useState<Quill | null>(null); // Specify Quill type
    const { id: documentId } = useParams<{ id: string }>(); // Specify parameter type


    useEffect(() => {
        
        if (socket == null || quil == null) return;

        const intervel = setInterval(() => {
            socket.emit('save-document', quil.getContents())
        }, SAVE_DOCUMENT)

        return () => {
            clearInterval(intervel);
        }
    }, [socket, quil]);

    useEffect(() => {
        if (socket == null || quil == null) return
        
        socket.once("load-document", document => {
            quil.setContents(document)
          quil.enable()  
        })

        socket.emit('get-document', documentId);
        
    }, [socket, quil, documentId]);


    useEffect(() => {
        const s = io("http://localhost:3001");
        setSocket(s);


        return () => {
            s.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket == null || quil == null) return
        const handler = (delta: DeltaStatic) => {
            quil.updateContents(delta);
        }

        socket.on("receive-changes", handler);

        return () => {
            socket.off('receive-changes', handler);
        }
    }, [socket, quil]);

    useEffect(() => {
        if (socket == null || quil == null) return
        const handler = (delta: DeltaStatic, oldDelta: DeltaStatic, source: string) => { // Add type annotations to delta and source
            if (source != 'user') return
            socket.emit("send-changes", delta);
        }

        quil.on('text-change', handler);
        

        return () => {
            quil.off('text-change', handler);
        }
    }, [socket, quil]);

    useEffect(() => {
        if (socket == null || quil == null) return
        const handler = (delta: DeltaStatic, oldDelta: DeltaStatic, source: string) => { // Add type annotations to delta and source
            if (source != 'user') return
            socket.emit("send-changes", delta);
        }

        quil.on('text-change', handler);
        

        return () => {
            quil.off('text-change', handler);
        }
    }, [socket, quil]);


    const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
        if (!wrapper) return;
    
        wrapper.innerHTML = '';
        const editor = document.createElement('div');
        wrapper.append(editor);
    
        const q = new Quill(editor, {
          theme: 'snow',
          modules: { toolbar: TOOLBAR_OPTIONS },
        });
    
        q.disable();
        q.setText('Loading');
        setQuil(q);
      }, []);

  return <div className="container" ref={wrapperRef}>TextEditor</div>;
}

export default TextEditor;
