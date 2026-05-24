import { ShieldCheck, Truck, RotateCcw } from 'lucide-react'

const OrderCTA = () => {
  return (
    <section id="order" className="bg-cream-dark py-28 px-6 text-center border-t border-ink/10">
      <div className="max-w-xl mx-auto">
        <p className="text-[10px] tracking-[0.3em] text-gold uppercase mb-4 font-bold">Ready to Try It?</p>
        <h2 className="text-4xl md:text-5xl font-bold text-ink">Extend the life <br/> of your books.</h2>
        <p className="mt-8 text-5xl md:text-7xl font-extrabold text-ink tracking-tighter">$14.99</p>
        <p className="mt-4 text-xs text-ink/50 tracking-wider">Free shipping over $30 • 30-day guarantee</p>
        
        <button className="mt-10 px-16 py-5 rounded-full bg-ink text-cream font-bold text-sm tracking-widest uppercase shadow-xl hover:bg-gold hover:-translate-y-1 transition-all duration-300">
          Buy Now
        </button>

        <div className="mt-12 flex justify-center gap-8 flex-wrap opacity-60">
          <Badge icon={<ShieldCheck size={16}/>} text="Secure Checkout" />
          <Badge icon={<Truck size={16}/>} text="Fast Shipping" />
          <Badge icon={<RotateCcw size={16}/>} text="30-Day Returns" />
        </div>
      </div>
    </section>
  )
}

const Badge = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
  return (
    <div className="flex items-center gap-2 text-[10px] font-bold text-ink uppercase tracking-wider">
      <span className="text-gold">{icon}</span>
      {text}
    </div>
  )
}


export default OrderCTA;