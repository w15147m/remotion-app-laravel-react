<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;



use App\Models\TempImage;

class TempImageController extends Controller
{
        public function index()
    {
        $tempImages = TempImage::orderby('created_at', 'DESC')->get();
        return response()->json(
            [
                'status' => 200,
                'data'   => $tempImages,
            ]
        );
    }

  

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => 'validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }
        $image     = $request->file('image');
        $imageName = time() . '.' . $image->extension();
        $image->move(public_path('uploads/temp'), $imageName);

        $tempImage       = new TempImage();
        $tempImage->name = $imageName;
        $tempImage->save();

        // $manager = new ImageManager(new Driver());
        // $img     = $manager->read(public_path('uploads/temp/' . $imageName));
        // $img->coverDown(400, 450);
        // $img->save(public_path('uploads/temp/thumb/' . $imageName));

        return response()->json([
            'message' => 'Category created',
            "data"    => $tempImage,
        ], 200);

    }
}
