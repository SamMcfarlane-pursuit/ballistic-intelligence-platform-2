import { Server } from 'socket.io';

export interface ConventionUpdate {
  type: 'new_company' | 'status_change' | 'score_update' | 'convention_added'
  data: any
  timestamp: string
}

export interface CompanyUpdate {
  companyId: string
  conventionId: string
  update: {
    status?: string
    score?: number
    notes?: string
    last_contact_date?: string
  }
  userId?: string
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join convention tracking rooms
    socket.on('join-convention', (conventionId: string) => {
      socket.join(`convention-${conventionId}`);
      console.log(`Client ${socket.id} joined convention ${conventionId}`);
    });

    // Leave convention tracking rooms
    socket.on('leave-convention', (conventionId: string) => {
      socket.leave(`convention-${conventionId}`);
      console.log(`Client ${socket.id} left convention ${conventionId}`);
    });

    // Join general convention updates
    socket.on('join-convention-updates', () => {
      socket.join('convention-updates');
      console.log(`Client ${socket.id} joined convention updates`);
    });

    // Handle company updates
    socket.on('update-company', async (update: CompanyUpdate) => {
      try {
        // Broadcast the update to all clients in the convention room
        const room = `convention-${update.conventionId}`;
        
        const conventionUpdate: ConventionUpdate = {
          type: 'status_change',
          data: {
            companyId: update.companyId,
            conventionId: update.conventionId,
            update: update.update,
            userId: update.userId,
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        };

        io.to(room).emit('convention-update', conventionUpdate);
        io.to('convention-updates').emit('convention-update', conventionUpdate);
        
        console.log('Company update broadcast:', conventionUpdate);
      } catch (error) {
        console.error('Error handling company update:', error);
        socket.emit('error', { message: 'Failed to process company update' });
      }
    });

    // Handle new company discovered
    socket.on('new-company-discovered', (companyData: any) => {
      const conventionUpdate: ConventionUpdate = {
        type: 'new_company',
        data: companyData,
        timestamp: new Date().toISOString()
      };

      // Broadcast to all clients tracking convention updates
      io.to('convention-updates').emit('convention-update', conventionUpdate);
      
      // Also broadcast to specific convention room if conventionId is provided
      if (companyData.conventionId) {
        io.to(`convention-${companyData.conventionId}`).emit('convention-update', conventionUpdate);
      }
      
      console.log('New company discovered:', conventionUpdate);
    });

    // Handle convention scraping progress
    socket.on('scraping-progress', (progress: {
      conventionId: string
      progress: number
      companiesFound: number
      message: string
    }) => {
      const room = `convention-${progress.conventionId}`;
      io.to(room).emit('scraping-progress', progress);
      io.to('convention-updates').emit('scraping-progress', progress);
    });

    // Handle AI analysis completion
    socket.on('ai-analysis-complete', (result: {
      companyId: string
      analysis: any
      confidence: number
    }) => {
      const conventionUpdate: ConventionUpdate = {
        type: 'score_update',
        data: {
          companyId: result.companyId,
          analysis: result.analysis,
          confidence: result.confidence,
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      };

      // Find which convention this company belongs to and broadcast
      // In a real implementation, you would query the database
      io.to('convention-updates').emit('convention-update', conventionUpdate);
    });

    // Handle messages (keep existing functionality)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      // Echo: broadcast message only the client who send the message
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Cybersecurity Convention Tracker WebSocket!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });

    // Notify about available conventions
    socket.emit('available-features', {
      features: [
        'convention-updates',
        'company-tracking',
        'scraping-progress',
        'ai-analysis'
      ]
    });
  });
};