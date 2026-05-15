import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  alpha,
  Tooltip
} from '@mui/material';
import {
  Call as CallIcon,
  CallEnd as CallEndIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideoCamIcon,
  VideocamOff as VideoCamOffIcon
} from '@mui/icons-material';


const CallContext = createContext(null);


export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};


export const CallProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ]
  };

  useEffect(() => {
    if (!socket) return;

    
    socket.on('call:incoming', (data) => {
      console.log('📞 Incoming call received in CallContext:', data);
      setIncomingCall(data);
    });

    socket.on('call:accepted', async (data) => {
      console.log('✅ Call accepted in CallContext:', data);
      await createPeerConnection(data.receiverId);
    });

    socket.on('call:rejected', (data) => {
      console.log('❌ Call rejected in CallContext:', data);
      alert(`Call rejected: ${data.reason}`);
      endCall();
    });

    socket.on('call:ended', () => {
      console.log('📴 Call ended in CallContext');
      alert('Call ended');
      endCall();
    });

    socket.on('call:failed', (data) => {
      console.log('❌ Call failed in CallContext:', data);
      alert(`Call failed: ${data.reason}`);
    });

    // WebRTC signaling
    socket.on('webrtc:offer', async ({ offer, senderId }) => {
      console.log('📨 WebRTC offer received in CallContext');
      await handleOffer(offer, senderId);
    });

    socket.on('webrtc:answer', async ({ answer }) => {
      console.log('📨 WebRTC answer received in CallContext');
      await handleAnswer(answer);
    });

    socket.on('webrtc:ice-candidate', async ({ candidate }) => {
      console.log('📨 ICE candidate received in CallContext');
      await handleIceCandidate(candidate);
    });

    return () => {
      socket.off('call:incoming');
      socket.off('call:accepted');
      socket.off('call:rejected');
      socket.off('call:ended');
      socket.off('call:failed');
      socket.off('webrtc:offer');
      socket.off('webrtc:answer');
      socket.off('webrtc:ice-candidate');
    };
  }, [socket]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const startCall = async (receiverId, callType = 'audio') => {
    try {
      console.log(`📞 Starting ${callType} call to:`, receiverId);
      
      
      if (!socket || !socket.connected) {
        alert('Not connected to server');
        return;
      }

     
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video'
      });
      
      setLocalStream(stream);
      setActiveCall({ receiverId, callType });
      setCallDialogOpen(true);

      
      socket.emit('call:start', { receiverId, callType });

     
      await createPeerConnection(receiverId);

      
      stream.getTracks().forEach(track => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream);
        }
      });

    } catch (error) {
      console.error('Error starting call:', error);
      alert('Could not access camera/microphone. Please check permissions.');
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      console.log('✅ Accepting call:', incomingCall);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: incomingCall.callType === 'video'
      });

      setLocalStream(stream);
      setActiveCall({
        receiverId: incomingCall.callerId,
        callType: incomingCall.callType,
        callId: incomingCall.callId
      });
      setCallDialogOpen(true);
      setIncomingCall(null);

     
      socket.emit('call:accept', { callId: incomingCall.callId });

   
      await createPeerConnection(incomingCall.callerId);

     
      stream.getTracks().forEach(track => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream);
        }
      });

    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      console.log('❌ Rejecting call:', incomingCall);
      socket.emit('call:reject', { callId: incomingCall.callId });
      setIncomingCall(null);
    }
  };

  const endCall = () => {
    console.log('📴 Ending call');
    
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);
    if (activeCall) {
      socket.emit('call:end', { callId: activeCall.callId });
    }
    setActiveCall(null);
    setCallDialogOpen(false);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log('🎤 Mute toggled:', !audioTrack.enabled ? 'Muted' : 'Unmuted');
      }
    }
  };

  const toggleVideo = () => {
    if (localStream && activeCall?.callType === 'video') {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        console.log('📹 Video toggled:', !videoTrack.enabled ? 'Off' : 'On');
      }
    }
  };

  const createPeerConnection = async (targetUserId) => {
    peerConnection.current = new RTCPeerConnection(configuration);

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('📨 Sending ICE candidate');
        socket.emit('webrtc:ice-candidate', {
          receiverId: targetUserId,
          candidate: event.candidate
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      console.log('📹 Remote stream received');
      setRemoteStream(event.streams[0]);
    };

   
    if (activeCall && !incomingCall) {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      console.log('📨 Sending WebRTC offer to:', targetUserId);
      socket.emit('webrtc:offer', {
        receiverId: targetUserId,
        offer
      });
    }
  };

  const handleOffer = async (offer, senderId) => {
    if (!peerConnection.current) return;
    
    console.log('📨 Received WebRTC offer from:', senderId);
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
    
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    
    console.log('📨 Sending WebRTC answer to:', senderId);
    socket.emit('webrtc:answer', {
      receiverId: senderId,
      answer
    });
  };

  const handleAnswer = async (answer) => {
    if (!peerConnection.current) return;
    console.log('📨 Received WebRTC answer');
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleIceCandidate = async (candidate) => {
    try {
      if (peerConnection.current) {
        console.log('📨 Adding ICE candidate');
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const value = {
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    incomingCall,
    activeCall
  };

  return (
    <CallContext.Provider value={value}>
      {children}

      <Dialog open={!!incomingCall} onClose={rejectCall} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            Incoming Call
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={3} sx={{ pb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#10b981' }}>
              {incomingCall?.callerName?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {incomingCall?.callerName || 'Unknown'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {incomingCall?.callType === 'video' ? '📹 Video Call' : '📞 Audio Call'}
            </Typography>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                color="success"
                startIcon={<CallIcon />}
                onClick={acceptCall}
                sx={{ borderRadius: 4, px: 4 }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CallEndIcon />}
                onClick={rejectCall}
                sx={{ borderRadius: 4, px: 4 }}
              >
                Reject
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      
      <Dialog open={callDialogOpen} onClose={endCall} maxWidth="md" fullWidth>
        <DialogContent>
          <Box sx={{ position: 'relative', minHeight: '400px' }}>
          
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px'
              }}
            />

            
            {activeCall?.callType === 'video' && (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  width: '150px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid white'
                }}
              />
            )}

            
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 2,
                bgcolor: alpha('#000', 0.7),
                p: 2,
                borderRadius: 4
              }}
            >
              <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                <span>
                  <IconButton
                    onClick={toggleMute}
                    sx={{ color: isMuted ? '#ef4444' : 'white' }}
                  >
                    {isMuted ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>
                </span>
              </Tooltip>

              {activeCall?.callType === 'video' && (
                <Tooltip title={isVideoOff ? 'Turn on video' : 'Turn off video'}>
                  <span>
                    <IconButton
                      onClick={toggleVideo}
                      sx={{ color: isVideoOff ? '#ef4444' : 'white' }}
                    >
                      {isVideoOff ? <VideoCamOffIcon /> : <VideoCamIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              <Tooltip title="End call">
                <span>
                  <IconButton
                    onClick={endCall}
                    sx={{ color: 'white', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
                  >
                    <CallEndIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </CallContext.Provider>
  );
};

export default CallProvider;