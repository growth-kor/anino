import React from 'react';

export type BlockType = 'setup' | 'loop' | 'pinMode' | 'digitalWrite' | 'delay' | 'ifInput' | 'debounceToggle';

export interface LogicBlock {
  id: string;
  type: BlockType;
  args?: Record<string, string>;
  children?: LogicBlock[]; 
}

interface CodeWorkspaceProps {
  blocks: LogicBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<LogicBlock[]>>;
  day?: number;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({ blocks, setBlocks, day = 1 }) => {
  const addBlock = (parentId: string, type: BlockType, args: Record<string, string>) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === parentId && b.children) {
        return { ...b, children: [...b.children, { id: `b-${Date.now()}`, type, args }] };
      }
      return b;
    }));
  };

  const generateCode = (blocks: LogicBlock[]): string => {
    let code = '';
    
    if (day === 5) {
      code += 'bool ledState = false;\n\n';
    }

    const setupBlock = blocks.find(b => b.type === 'setup');
    if (setupBlock) {
      code += 'void setup() {\n';
      setupBlock.children?.forEach(child => {
        if (child.type === 'pinMode') {
          code += `  pinMode(${child.args?.pin}, ${child.args?.mode});\n`;
        }
      });
      code += '}\n\n';
    }

    const loopBlock = blocks.find(b => b.type === 'loop');
    if (loopBlock) {
      code += 'void loop() {\n';
      loopBlock.children?.forEach(child => {
        if (child.type === 'digitalWrite') {
          code += `  digitalWrite(${child.args?.pin}, ${child.args?.state});\n`;
        } else if (child.type === 'delay') {
          code += `  delay(${child.args?.ms});\n`;
        } else if (child.type === 'ifInput') {
          code += `  if (digitalRead(2) == LOW) {\n`;
          code += `    digitalWrite(13, HIGH);\n`;
          code += `  } else {\n`;
          code += `    digitalWrite(13, LOW);\n`;
          code += `  }\n`;
        } else if (child.type === 'debounceToggle') {
          code += `  if (digitalRead(2) == LOW) {\n`;
          code += `    delay(50); // 디바운싱 바운스 대기\n`;
          code += `    if (digitalRead(2) == LOW) {\n`;
          code += `      ledState = !ledState;\n`;
          code += `      digitalWrite(13, ledState);\n`;
          code += `      while(digitalRead(2) == LOW); // 뗄 때까지 대기\n`;
          code += `    }\n`;
          code += `  }\n`;
        }
      });
      code += '}\n';
    }

    return code;
  };

  const codeText = generateCode(blocks);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      
      {/* Toolbox (Block Palette based on Day) */}
      <div className="glass-panel" style={{ padding: '12px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {day === 1 && (
          <>
            <button className="toolbox-btn" onClick={() => addBlock('b-setup', 'pinMode', { pin: '13', mode: 'OUTPUT' })}>
              + pinMode(13, OUTPUT)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-loop', 'digitalWrite', { pin: '13', state: 'HIGH' })}>
              + digitalWrite(13, HIGH)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-loop', 'digitalWrite', { pin: '13', state: 'LOW' })}>
              + digitalWrite(13, LOW)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-loop', 'delay', { ms: '1000' })}>
              + delay(1000)
            </button>
          </>
        )}
        
        {day === 4 && (
          <>
            <button className="toolbox-btn" onClick={() => addBlock('b-setup', 'pinMode', { pin: '2', mode: 'INPUT_PULLUP' })}>
              + pinMode(2, INPUT_PULLUP)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-setup', 'pinMode', { pin: '13', mode: 'OUTPUT' })}>
              + pinMode(13, OUTPUT)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-loop', 'ifInput', {})}>
              + if (digitalRead(2) == LOW)
            </button>
          </>
        )}

        {day === 5 && (
          <>
            <button className="toolbox-btn" onClick={() => addBlock('b-setup', 'pinMode', { pin: '2', mode: 'INPUT_PULLUP' })}>
              + pinMode(2, INPUT_PULLUP)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-setup', 'pinMode', { pin: '13', mode: 'OUTPUT' })}>
              + pinMode(13, OUTPUT)
            </button>
            <button className="toolbox-btn" onClick={() => addBlock('b-loop', 'debounceToggle', {})}>
              + if (디바운스_버튼_토글)
            </button>
          </>
        )}
        
        <style>{`
          .toolbox-btn {
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: #c7d2fe;
            padding: 8px 14px;
            border-radius: 6px;
            font-family: var(--font-family-mono);
            font-size: 0.9rem;
            white-space: nowrap;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
          }
          .toolbox-btn:hover { 
            background: rgba(99, 102, 241, 0.4); 
            transform: translateY(-1px);
          }
        `}</style>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '16px', overflow: 'hidden' }}>
        
        {/* Visual Blocks Area */}
        <div className="glass-panel" style={{ flex: 1, padding: '16px', overflowY: 'auto', background: 'rgba(9, 9, 11, 0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: 0, fontWeight: 700 }}>VISUAL BLOCKS</h3>
            <button 
              onClick={() => setBlocks([
                { id: 'b-setup', type: 'setup', children: [] },
                { id: 'b-loop', type: 'loop', children: [] }
              ])}
              style={{ background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              블록 지우기
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {blocks.map(b => (
              <div key={b.id} style={{
                background: b.type === 'setup' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                border: `1px solid ${b.type === 'setup' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                borderRadius: '8px',
                padding: '16px',
                minHeight: '120px'
              }}>
                <div style={{ fontWeight: 700, color: b.type === 'setup' ? '#86efac' : '#93c5fd', marginBottom: '12px', fontFamily: 'var(--font-family-mono)', fontSize: '1.05rem' }}>
                  {b.type === 'setup' ? 'void setup()' : 'void loop()'}
                </div>
                
                {/* Children Blocks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '16px', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                  {b.children?.length === 0 && <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>상단에서 블록을 클릭하여 추가하세요</div>}
                  {b.children?.map(child => (
                    <div key={child.id} style={{
                      background: 'rgba(39, 39, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-family-mono)',
                      fontSize: '1rem',
                      color: '#e4e4e7',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                      fontWeight: 500
                    }}>
                      {child.type === 'pinMode' && <><span style={{ color: '#fbbf24' }}>pinMode</span>({child.args?.pin}, <span style={{ color: '#38bdf8' }}>{child.args?.mode}</span>)</>}
                      {child.type === 'digitalWrite' && <><span style={{ color: '#fbbf24' }}>digitalWrite</span>({child.args?.pin}, <span style={{ color: '#38bdf8' }}>{child.args?.state}</span>)</>}
                      {child.type === 'delay' && <><span style={{ color: '#fbbf24' }}>delay</span>(<span style={{ color: '#f87171' }}>{child.args?.ms}</span>)</>}
                      {child.type === 'ifInput' && (
                        <div style={{ lineHeight: 1.5 }}>
                          <span style={{ color: '#c678dd' }}>if</span> (<span style={{ color: '#61afef' }}>digitalRead</span>(<span style={{ color: '#d19a66' }}>2</span>) == <span style={{ color: '#d19a66' }}>LOW</span>) {'{'} <br/>
                          &nbsp;&nbsp;<span style={{ color: '#61afef' }}>digitalWrite</span>(<span style={{ color: '#d19a66' }}>13</span>, <span style={{ color: '#d19a66' }}>HIGH</span>); <br/>
                          {'}'} <span style={{ color: '#c678dd' }}>else</span> {'{'} <br/>
                          &nbsp;&nbsp;<span style={{ color: '#61afef' }}>digitalWrite</span>(<span style={{ color: '#d19a66' }}>13</span>, <span style={{ color: '#d19a66' }}>LOW</span>); <br/>
                          {'}'}
                        </div>
                      )}
                      {child.type === 'debounceToggle' && (
                        <div style={{ lineHeight: 1.5 }}>
                          <span style={{ color: '#c678dd' }}>if</span> (<span style={{ color: '#61afef' }}>digitalRead</span>(<span style={{ color: '#d19a66' }}>2</span>) == <span style={{ color: '#d19a66' }}>LOW</span>) {'{'} <br/>
                          &nbsp;&nbsp;<span style={{ color: '#61afef' }}>delay</span>(<span style={{ color: '#d19a66' }}>50</span>); <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>// 디바운스 바운스 대기</span><br/>
                          &nbsp;&nbsp;<span style={{ color: '#c678dd' }}>if</span> (<span style={{ color: '#61afef' }}>digitalRead</span>(<span style={{ color: '#d19a66' }}>2</span>) == <span style={{ color: '#d19a66' }}>LOW</span>) {'{'} <br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;ledState = !ledState;<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#61afef' }}>digitalWrite</span>(<span style={{ color: '#d19a66' }}>13</span>, ledState);<br/>
                          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c678dd' }}>while</span>(<span style={{ color: '#61afef' }}>digitalRead</span>(<span style={{ color: '#d19a66' }}>2</span>) == <span style={{ color: '#d19a66' }}>LOW</span>); <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>// 뗄 때까지 대기</span><br/>
                          &nbsp;&nbsp;{'}'}<br/>
                          {'}'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* C++ Code Area */}
        <div className="glass-panel" style={{ flex: 1, padding: '16px', overflowY: 'auto', background: '#09090b' }}>
           <h3 style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '12px', fontWeight: 700 }}>C++ CODE</h3>
           <pre style={{ 
             margin: 0, 
             fontFamily: 'var(--font-family-mono)', 
             fontSize: '1.05rem',
             color: '#e4e4e7',
             lineHeight: 1.7
           }}>
             {codeText.split('\n').map((line, i) => {
               let highlighted = line
                 .replace(/\b([0-9]+)\b/g, '<span style="color: #d19a66;">$1</span>')
                 .replace(/\b(void|setup|loop|bool|if|else|while)\b/g, '<span style="color: #c678dd;">$1</span>')
                 .replace(/\b(pinMode|digitalWrite|delay|digitalRead)\b/g, '<span style="color: #61afef;">$1</span>')
                 .replace(/\b(OUTPUT|INPUT_PULLUP|HIGH|LOW)\b/g, '<span style="color: #d19a66;">$1</span>');
               
               return (
                 <div key={i} dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />
               );
             })}
           </pre>
        </div>

      </div>
    </div>
  );
};
