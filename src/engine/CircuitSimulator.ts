export type PinType = 'POWER' | 'GND' | 'DIGITAL' | 'ANALOG' | 'COMPONENT';
export type ComponentType = 'LED' | 'RESISTOR' | 'BUZZER' | 'ULTRASONIC' | 'BUTTON';

export interface Node {
  id: string; // e.g., 'UNO-PIN-13', 'BREADBOARD-A1', 'LED1-ANODE'
  type: PinType;
  voltage: number; // 0 to 5
}

export interface Wire {
  id: string;
  sourceId: string;
  targetId: string;
  color: string;
}

export interface HardwareComponent {
  id: string;
  type: ComponentType;
  pins: { [key: string]: Node };
  state: any; // e.g., { isBurning: false, isOn: true }
}

export class CircuitSimulator {
  nodes: Map<string, Node> = new Map();
  wires: Wire[] = [];
  components: HardwareComponent[] = [];

  constructor() {
    this.reset();
  }

  reset() {
    this.nodes.clear();
    this.wires = [];
    this.components = [];
    // Initialize standard Arduino UNO pins
    this.initUnoPins();
  }

  initUnoPins() {
    const pins = [
      { id: 'UNO-GND-1', type: 'GND' as PinType },
      { id: 'UNO-GND-2', type: 'GND' as PinType },
      { id: 'UNO-5V', type: 'POWER' as PinType },
      { id: 'UNO-3V3', type: 'POWER' as PinType },
    ];
    for (let i = 0; i <= 13; i++) {
      pins.push({ id: `UNO-D${i}`, type: 'DIGITAL' as PinType });
    }
    for (let i = 0; i <= 5; i++) {
      pins.push({ id: `UNO-A${i}`, type: 'ANALOG' as PinType });
    }

    pins.forEach(p => {
      this.nodes.set(p.id, { id: p.id, type: p.type, voltage: p.type === 'POWER' ? 5 : 0 });
    });
  }

  addWire(sourceId: string, targetId: string, color: string = '#a1a1aa') {
    const wireId = `wire-${Date.now()}`;
    this.wires.push({ id: wireId, sourceId, targetId, color });
    this.evaluateCircuit();
    return wireId;
  }

  removeWire(wireId: string) {
    this.wires = this.wires.filter(w => w.id !== wireId);
    this.evaluateCircuit();
  }

  addComponent(comp: HardwareComponent) {
    this.components.push(comp);
    Object.values(comp.pins).forEach(pin => {
      this.nodes.set(pin.id, pin);
    });
  }

  // Very simplified evaluation tick
  evaluateCircuit() {
    // 1. Reset all non-power nodes to 0V
    this.nodes.forEach(node => {
      if (node.type !== 'POWER' && !node.id.startsWith('UNO-D')) {
        node.voltage = 0;
      }
    });

    // 2. Build adjacency list for connected components
    const adj = new Map<string, string[]>();
    this.nodes.forEach(n => adj.set(n.id, []));
    
    this.wires.forEach(w => {
      adj.get(w.sourceId)?.push(w.targetId);
      adj.get(w.targetId)?.push(w.sourceId);
    });

    // Add internal component connections (e.g. Breadboard rows, shorted pins)
    // For now, let's just handle simple wire graphs.

    // 3. Flood fill from POWER pins to distribute voltage
    // (This is a huge simplification, assuming no voltage drops unless specific components)
    let queue: string[] = [];
    this.nodes.forEach(n => {
      if (n.type === 'POWER' || (n.type === 'DIGITAL' && n.voltage === 5)) {
        queue.push(n.id);
      }
    });

    const visited = new Set<string>();
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (visited.has(curr)) continue;
      visited.add(curr);

      const currNode = this.nodes.get(curr);
      if (!currNode) continue;

      adj.get(curr)?.forEach(neighbor => {
        const neighborNode = this.nodes.get(neighbor);
        if (neighborNode && neighborNode.type !== 'POWER') {
          // Check for short circuit (5V connected directly to GND without resistance)
          if (neighborNode.type === 'GND' && currNode.voltage === 5) {
             console.error("SHORT CIRCUIT DETECTED!");
             // Trigger global short circuit event
          } else {
            neighborNode.voltage = currNode.voltage;
            queue.push(neighbor);
          }
        }
      });
    }

    // 4. Update component states based on node voltages
    this.components.forEach(comp => {
      if (comp.type === 'LED') {
        const anode = comp.pins['ANODE'];
        const cathode = comp.pins['CATHODE'];
        
        // Simplified check: if Anode is 5V and Cathode is connected to GND
        if (anode.voltage > 0 && this.isConnectedToGnd(cathode.id, adj)) {
          // Check if there is a resistor in the path
          // For MVP, if Anode voltage is 5V directly, it burns. 
          // If it's a Digital Pin, we might treat it as having internal resistance for safety in this toy model, or enforce resistors.
          if (anode.voltage === 5) {
             comp.state.isBurning = true;
             comp.state.isOn = false;
          } else {
             comp.state.isOn = true;
          }
        } else {
          comp.state.isOn = false;
        }
      }
    });
  }

  private isConnectedToGnd(startNodeId: string, adj: Map<string, string[]>): boolean {
    let queue = [startNodeId];
    let visited = new Set<string>();
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (visited.has(curr)) continue;
      visited.add(curr);
      const node = this.nodes.get(curr);
      if (node?.type === 'GND') return true;
      adj.get(curr)?.forEach(n => queue.push(n));
    }
    return false;
  }
}
