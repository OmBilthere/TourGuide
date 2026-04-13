import { assets } from "../assets/assets";

const Testimonial = () => {
    
    const dummyTestimonialData = [
        {
            image: "https://randomuser.me/api/portraits/men/54.jpg",
            name: 'Aarav Mehta',
            title: 'Traveler from Mumbai',
            content: 'Tour Guide made our Pune heritage trip smooth and memorable. The local guide knew hidden places, food spots, and great photo locations.',
            rating: 4,
        },
        {
            image: "https://randomuser.me/api/portraits/women/65.jpg",
            name: 'Priya Sharma',
            title: 'Solo Traveler',
            content: 'Booking a Jaipur local guide was super easy. The personalized city tour saved time and gave a much better experience than exploring alone.',
            rating: 5,
        },
        {
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            name: 'Rohan Verma',
            title: 'Weekend Explorer',
            content: 'I loved the simple booking flow and verified guides. It helped us explore Goa like locals instead of following generic tourist routes.',
            rating: 4,
        },
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24'>
            <div className='text-center'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>Loved by Travelers</h2>
                <p className='text-gray-500 max-w-lg mx-auto'>See what our travelers say about exploring cities with trusted local guides.</p>
            </div>
            <div className='flex flex-wrap mt-10 justify-center'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer'>
                        <div className="flex items-center gap-1">
                           {
                            Array(5).fill(0).map((_, index) => (<img className="w-4 h-4" alt=""
                                 key={index} src={index < testimonial.rating ? assets.star_icon : assets.star_dull_icon} />))
                           }
                        </div>
                        <p className='text-gray-500 text-sm my-5'>"{testimonial.content}"</p>
                        <hr className='mb-5 border-gray-300' />
                        <div className='flex items-center gap-4'>
                            <img src={testimonial.image} className='w-12 object-contain rounded-full' alt='' />
                            <div className='text-sm text-gray-600'>
                                <h3 className='font-medium'>{testimonial.name}</h3>
                                <p className='text-xs text-gray-500'>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial;