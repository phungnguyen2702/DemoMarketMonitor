Rails.application.routes.draw do
  root 'home#barchart'

  get 'scartter', to: "home#scartter"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
