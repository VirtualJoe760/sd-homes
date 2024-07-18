import connectDB from "@/config/database";
import Property from '@/models/Property';
import { getSessionUser } from '@/utils/getSessionUser';
import cloudinary from '@/config/cloudinary';


export const GET = async (request) => {
  try {
    await connectDB();

    const properties = await Property.find({});

    return new Response(JSON.stringify(properties), {
      status: 200,
    });
  } catch (error) {
    return new Response("Uhoh Something went wrong...", {
      status: 500
    });
  }
};

export const POST = async (request) => {
  try {
    console.log('The beginning of my testing');

    await connectDB();

    const sessionUser = await getSessionUser();

    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', {status: 401});
    }

    const { userId } = sessionUser;


    const formData = await request.formData();

    // access all values from amenities and images
    const amenities = formData.getAll('amenities');
    const images = formData.getAll('images').filter((image) => image.name !== '');

    // create property data object for database

    const propertyData = {
      type: formData.get('type'),
      name: formData.get('name'),
      description: formData.get('description'),
      location: {
        street: formData.get('location.street'),
        city: formData.get('location.city'),
        state: formData.get('location.state'),
        zipcode: formData.get('location.zipcode')
      },
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      square_feet: formData.get('square_feet'),
      amenities,
      rates: {
        weekly: formData.get('rates.weekly'),
        monthly: formData.get('rates.monthly'),
        nightly: formData.get('rates.nightly'),
      },
      seller_info: {
        name: formData.get('seller_info.name'),
        email: formData.get('seller_info.email'),
        phone: formData.get('seller_info.phone'),
      },
      owner: userId,
    };
    console.log(propertyData);
    

    //upload images to cloudinary

    const imageUploadPromises = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      // console.log('Image Buffer Obtained:', imageBuffer);

      const imageArray = Array.from(new Uint8Array(imageBuffer));
      // console.log('Image Array Obtained:', imageArray);

      const imageData = Buffer.from(imageArray);
      // console.log('Image Data Obtained:', imageData);

      // convert the image data to base 64

      const imageBase64 = imageData.toString('base64');
      // console.log('Image base64:', imageBase64);

      //make request to upload to cloudinary
      let result;
      try {
        result = await cloudinary.uploader.upload(
          `data:image/png;base64,${imageBase64}`,
          {
            folder: 'sdhomes',
          },
        );
      } catch (error) {
        console.log(error)
      }
 
      
      console.log(result);
      imageUploadPromises.push(result.secure_url);
      
      //wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      
      // add uploaded images to the propertyData object
      propertyData.images = uploadedImages;
    }

    const newProperty = new Property(propertyData);
    console.log(newProperty);
    await newProperty.save();

    return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${newProperty._id}`);

  } catch (error) {
    return new Response('Catch Error: Failed to add property', { status: 500 });
  }
};