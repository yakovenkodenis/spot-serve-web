type Params = {
  cacheKey: string;
  querystring: string;
}

export function getRefreshButtonScript(params: Params): HTMLScriptElement {
  const { cacheKey, querystring } = params;

  const script = document.createElement('script');

  script.textContent = `
    (function() {
      const button = document.createElement('div');
      button.innerHTML = \`
        <svg viewBox="0 0 24 24" style="width: 24px; height: 24px; fill: white;">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
      \`;
      
      // Styling with updated gradient and a matching box-shadow
      button.style.cssText = \`
        position: fixed;
        bottom: 32px;
        right: 32px;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #ff7eb3, #ff758c, #42a5f5);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 32px rgba(66,165,245, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 99999;
        border: none;
        user-select: none;
      \`;

      // Hover effects
      button.addEventListener('mouseover', () => {
        button.style.transform = 'scale(1.1)';
        button.style.boxShadow = '0 12px 40px rgba(66,165,245, 0.4)';
      });
      
      button.addEventListener('mouseout', () => {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 8px 32px rgba(66,165,245, 0.3)';
      });

      // Click animation and cache refresh
      button.addEventListener('click', (e) => {
        // Only trigger click if a drag wasn’t performed.
        if (!button.dataset.dragging) {
          button.style.transform = 'scale(0.9)';
          setTimeout(() => {
            caches.delete('${cacheKey}').then(() => {
              history.replaceState(null, null, location.origin + '${querystring}');
              location.reload(true);
            }).catch((error) => {
              console.error(error);
            });
          }, 200);
        }
      });

      // --- Drag functionality ---
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;
      let mouseDownX = 0;
      let mouseDownY = 0;
      const dragThreshold = 5; // pixels

      button.addEventListener('mousedown', (e) => {
        // Prevent accidental text selection
        e.preventDefault();
        mouseDownX = e.clientX;
        mouseDownY = e.clientY;
        const rect = button.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      function onMouseMove(e) {
        if (!isDragging) {
          const dx = e.clientX - mouseDownX;
          const dy = e.clientY - mouseDownY;
          if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
            isDragging = true;
            button.dataset.dragging = 'true';
            button.style.transition = 'none';
          }
        }
        if (isDragging) {
          // Update button position based on pointer movement.
          button.style.left = (e.clientX - dragOffsetX) + 'px';
          button.style.top = (e.clientY - dragOffsetY) + 'px';
          // When dragging, remove fixed bottom/right positioning.
          button.style.bottom = 'auto';
          button.style.right = 'auto';
        }
      }

      function onMouseUp(e) {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        
        if (isDragging) {
          // Optionally, snap to the left or right edge based on the final position.
          const rect = button.getBoundingClientRect();
          if (rect.left < window.innerWidth / 2) {
            button.style.left = rect.left + 'px';
            button.style.right = 'auto';
          } else {
            const right = window.innerWidth - rect.right;
            button.style.right = right + 'px';
            button.style.left = 'auto';
          }
        }
        // Remove the drag flag (using a timeout to ensure the click event sees it if needed)
        setTimeout(() => {
          delete button.dataset.dragging;
        }, 0);
        isDragging = false;
      }

      // Prevent text selection during drag
      document.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
      });

      document.body.appendChild(button);
    })();
  `;

  return script;
}
